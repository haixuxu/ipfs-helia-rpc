import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";

export async function createIpfsNode() {
  // create a Helia node
  const helia = await createHelia();

  // print out our node's PeerId
  console.log(helia.libp2p.peerId);
  // create a filesystem on top of Helia, in this case it's UnixFS
  const fs = unixfs(helia);

  // we will use this TextEncoder to turn strings into Uint8Arrays
  const encoder = new TextEncoder();

  // add the bytes to your node and receive a unique content identifier
  const cid = await fs.addBytes(
    encoder.encode("Hello World 101"),
    helia.blockstore
  );

  console.log("Added file:", cid.toString());

  return {
    node: helia,
    fs,
    peerId: helia.libp2p.peerId,
    addFile: function (fileUint8Array) {
      // add the bytes to your node and receive a unique content identifier
      return fs.addBytes(fileUint8Array, helia.blockstore);
    },
  };
}
