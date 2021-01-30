import {
  Box,
  Button,

  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Textarea
} from "@chakra-ui/react";
import { HashedBotIdenticon } from "@digitalungdom/bot-identicon";
import Arweave from 'arweave';
import { JWKInterface } from "arweave/web/lib/wallet";
import crypto from "libp2p-crypto";
import PeerId from "peer-id";
import React from "react";
import QrReader  from "react-qr-scanner";



const PeerProfile: React.FC= () => {
  const [remote, setRemote] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  const [key, setKey] = React.useState<JWKInterface>();


  const getKey = async () => {
    if (remote) {

      console.log('key is', remote)
      let peer: PeerId;
      let key: crypto.PrivateKey;
      try {
        peer = await PeerId.createFromPrivKey(remote);
        console.log(peer)
        key = await crypto.keys.unmarshalPrivateKey(peer.marshalPrivKey());
        console.log(key)
        //@ts-ignore
        setKey(key);
        let arweave = Arweave.init({})
        //@ts-ignore
        console.log('address is ', arweave.wallets.jwkToAddress(key._key))
      } catch (err) {
        console.log("Error!", err);
         }}
  };
  
  return (
    <Box d="flex" alignItems="baseline">
      <Skeleton isLoaded={remote !== ""}>
        <HashedBotIdenticon identifier={remote} />
      </Skeleton>
      <Box align="center">
        <Textarea
          height="200px"
          width="200px"
          value={remote}
          placeholder="Key"
          type="password"
          onChange={(evt) => setRemote(evt.target.value)}
        />
        <HStack>
          <Button onClick={getKey}>Validate key</Button>
          <Button onClick={() => setOpen(true)}>Read QR Code</Button>
        </HStack>
        <Textarea value={JSON.stringify(key)} /> 
      </Box>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalBody>
              <QrReader
                delay={100}
                onError={(err: any) => console.log(err)}
                onScan={(res: any) => {
                  if (res) {
                    setOpen(false);
                    console.log(res)
                    setRemote(res)
                  }
                }}
                maxImageSize={10000}
                style={{ width: "100%" }}
              />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Box>
  );
};

export default PeerProfile;
