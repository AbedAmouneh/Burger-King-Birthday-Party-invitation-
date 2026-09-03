import Foundation
import Vision
import CoreImage
import AppKit

// Lift the foreground subject(s) out of a photo using the same Vision model
// that powers Photos' "copy subject". Writes a straight-alpha PNG.
guard CommandLine.arguments.count >= 3 else {
    FileHandle.standardError.write("usage: lift <in.jpg> <out.png> [instanceIndex]\n".data(using: .utf8)!)
    exit(2)
}
let inURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outURL = URL(fileURLWithPath: CommandLine.arguments[2])
let wantIndex: Int? = CommandLine.arguments.count > 3 ? Int(CommandLine.arguments[3]) : nil

// applyingOrientationProperty honours the EXIF tag, so the mask lines up with
// an -auto-orient'ed source.
guard let ciImage = CIImage(contentsOf: inURL, options: [.applyOrientationProperty: true]) else {
    FileHandle.standardError.write("could not read image\n".data(using: .utf8)!); exit(1)
}

let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
do { try handler.perform([request]) } catch {
    FileHandle.standardError.write("vision failed: \(error)\n".data(using: .utf8)!); exit(1)
}
guard let result = request.results?.first else {
    FileHandle.standardError.write("NO_SUBJECT_FOUND\n".data(using: .utf8)!); exit(3)
}

let all = result.allInstances
FileHandle.standardError.write("instances=\(all.count)\n".data(using: .utf8)!)
let instances: IndexSet = {
    if let i = wantIndex, all.contains(i) { return IndexSet(integer: i) }
    return all
}()

let pixelBuffer = try! result.generateMaskedImage(
    ofInstances: instances, from: handler, croppedToInstancesExtent: false)

let ctx = CIContext()
let out = CIImage(cvPixelBuffer: pixelBuffer)
try! ctx.writePNGRepresentation(
    of: out, to: outURL, format: .RGBA8,
    colorSpace: CGColorSpaceCreateDeviceRGB())
print("wrote \(outURL.path)")
