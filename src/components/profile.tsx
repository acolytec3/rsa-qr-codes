import React from "react";
import {
  Box,
  Button,
  Skeleton,

  VStack,
} from "@chakra-ui/react";
import { HashedBotIdenticon } from "@digitalungdom/bot-identicon";
import QRCode from "qrcode.react";
import { generateMnemonic, getKeyFromMnemonic } from "arweave-mnemonic-keys";
import { JWKInterface } from "arweave/web/lib/wallet";
import PeerID from "peer-id";
import crypto from "libp2p-crypto";

const Profile = () => {
  const [loading, setLoading] = React.useState(true);
  const [id, setId] = React.useState<string>("");
  const [mnemonic, setMnemonic] = React.useState("");
  const [key, setKey] = React.useState<JWKInterface>();
  const inputFile = React.useRef(null);

  React.useEffect(() => {
    let mounted = true;

    async function getKey() {
      console.log(JSON.stringify(key).length)
      //@ts-ignore
      let cryptoKey = await crypto.keys.supportedKeys.rsa.fromJwk(key);

      //@ts-ignore
      let peer = await PeerID.createFromPrivKey(cryptoKey.bytes);
      let ID = peer.toJSON().privKey!;
      console.log('key length', ID.length)
      setId(ID);
      setLoading(false);
    }
    if (key && mounted) {
      getKey();
    }
    return () => {
      mounted = false;
    };
  }, [key]);

  const onDrop = async (acceptedFiles: any) => {

    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = async function (event) {
      setLoading(true);
      if (acceptedFiles[0].type === "application/json") {
        try {
          let walletObject = JSON.parse(event!.target!.result as string);
          setKey(walletObject);
        } catch (err) {
          console.log(err);
        }
      }
    };
    reader.readAsText(acceptedFiles[0]);
  };

  return (
    <Box d="flex" alignItems="baseline">
      <input
        type="file"
        id="file"
        ref={inputFile}
        style={{ display: "none" }}
        onChange={(evt) => onDrop(evt.target.files)}
      />
      <Skeleton isLoaded={!loading && id !== ""}>
        <HashedBotIdenticon identifier={id} />
      </Skeleton>
      <Box align="center" marginY={5}>
        {id && (
          <VStack>
            <QRCode value={id} size={300} />
          </VStack>
        )}
        <Button
          onClick={async () => {
            let mnemonic = await generateMnemonic();
            setMnemonic(mnemonic);
            let wallet = await getKeyFromMnemonic(mnemonic);
            setKey(wallet);
          }}
        >
          Generate Wallet
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
