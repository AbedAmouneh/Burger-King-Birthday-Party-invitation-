import Foundation
import Vision
import CoreImage

// Report face bounding boxes in TOP-LEFT pixel coordinates of the
// EXIF-oriented image, so ImageMagick -crop can consume them directly.
guard CommandLine.arguments.count >= 2 else { exit(2) }
let inURL = URL(fileURLWithPath: CommandLine.arguments[1])
guard let ci = CIImage(contentsOf: inURL, options: [.applyOrientationProperty: true]) else { exit(1) }

let w = ci.extent.width, h = ci.extent.height
let handler = VNImageRequestHandler(ciImage: ci, options: [:])
let req = VNDetectFaceRectanglesRequest()
try handler.perform([req])

let faces = (req.results ?? []).sorted { $0.boundingBox.minX < $1.boundingBox.minX }
print("image \(Int(w)) \(Int(h)) faces \(faces.count)")
for f in faces {
    let b = f.boundingBox                     // normalised, origin bottom-left
    let x = b.minX * w
    let bw = b.width * w
    let bh = b.height * h
    let y = (1 - b.maxY) * h                  // flip to top-left origin
    print(String(format: "face %.0f %.0f %.0f %.0f roll %.3f yaw %.3f",
                 x, y, bw, bh, f.roll?.doubleValue ?? 0, f.yaw?.doubleValue ?? 0))
}
