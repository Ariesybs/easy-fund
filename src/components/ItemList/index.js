import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Item from "../Item";
import Paging from "../Paging";
import { Fcontract } from "\u0016\u0016@component/contract";

export default function ItenList() {
  const [FC, setFC] = useState();

  const [ids, setIds] = useState([]);
  useEffect(() => {
    const crowdfunding = require("../../../build/contracts/crowdfunding.json");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const FContract = new ethers.Contract(
      crowdfunding.networks[5777].address,
      JSON.stringify(crowdfunding.abi),
      signer
    );
    setFC(FContract);
    FContract.getAllItems().then((data) => {
      setIds(data);
    });
  }, []);
  return (
    <div>
      <div class="container">
        <div class="page-header">
          <h1>
            众筹项目<small>crowdfunding project</small>
          </h1>
        </div>

        <div class="row">
          {ids.map((id) => {
            return <Item key={id} id={id} FC={FC} />;
          })}
        </div>
        <Paging />
      </div>
    </div>
  );
}
