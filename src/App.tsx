import React from "react";
import { VStack } from "@chakra-ui/react";

import Profile from "./components/profile";
import PeerProfile from "./components/peerProfile";

export default function App() {
  return (
      <VStack align="center" w="100vw">
            <Profile />
            <PeerProfile />
      </VStack>
  );
}
