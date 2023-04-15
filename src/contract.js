import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const Fcontract = () => {
  const crowdfunding = require("../build/contracts/crowdfunding.json");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const FContract = new ethers.Contract(
    crowdfunding.networks[5777].address,
    JSON.stringify(crowdfunding.abi),
    signer
  );
  return FContract;
};
