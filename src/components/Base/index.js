import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
const FCContext = createContext();
export default function Base({ children }) {
  const [FC, setFC] = useState(null);
  useEffect(() => {
    const crowdfunding = require("../../../build/contracts/crowdfunding.json");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const FContract = new ethers.Contract(
      crowdfunding.networks[5777].address,
      JSON.stringify(crowdfunding.abi),
      signer
    );
    setFC(FContract);
  }, []);

  return <FCContext.Provider value={{ FC: FC }}>{children}</FCContext.Provider>;
}
export { FCContext };
