import Narbar from "\u0016\u0016@component/components/Navbar";
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default function details() {
  const router = useRouter();
  const [FC, setFC] = useState();
  const [curAccount, setCurAccount] = useState("");
  const [id, setId] = useState();
  const [maxDonate, setMaxDonate] = useState(0);
  const [maxFunds, setMaxFunds] = useState(0);
  const [info, setInfo] = useState("");
  const [guarantors, setGuarantors] = useState([]);
  const [donorsAddr, setDonorsAddr] = useState([""]);
  const [donorName, setDonorName] = useState([""]);
  const [donateAmount, setDonateAmount] = useState([]);
  const [donateTime, setDonateTime] = useState([]);
  const [curFund, setCurFund] = useState(0);
  const [needFund, setNeedFund] = useState(0);
  const curTime = new Date(new Date()).getTime();
  const inputDonote = useRef();
  const inputName = useRef();
  const inputFund = useRef();
  useEffect(() => {
    const crowdfunding = require("../../../build/contracts/crowdfunding.json");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const FContract = new ethers.Contract(
      crowdfunding.networks[5777].address,
      JSON.stringify(crowdfunding.abi),
      signer
    );
    setAccount();
    setFC(FContract);
    let location = window.location.href.split("/");
    const Id = parseInt(location[location.length - 1]);
    setId(Id);
    FContract.getItemById(Id)
      .then((data) => {
        if (parseInt(data._id) === 0) {
          window.location.href = "/";
        }

        setInfo(data);
        setGuarantors(data._guarantors);
        setDonorsAddr(data._donors);
        setDonorName(data._donorName);
        setDonateAmount(data._donations);
        setDonateTime(data._donateTime);
        setCurFund(parseFloat(data._currentFunds / 10 ** 18));
        setNeedFund(parseFloat(data._needFunds));
      })
      .catch((e) => {});

    FContract.getMaxDonate(Id)
      .then((res) => {
        setMaxDonate(parseFloat(res / 100));
      })
      .catch((e) => {});

    FContract.getMaxFunds(Id)
      .then((res) => {
        setMaxFunds(res);
      })
      .catch((e) => {});
  }, []);

  async function donate() {
    let amount = inputDonote.current.value;
    if (amount > maxDonate || amount <= 0) {
      alert("金额输入有误!");
      return;
    }
    if (!confirm(`确认为该项目捐赠 ${amount} ETH?`)) {
      return;
    }
    let name =
      inputName.current.value === "" ? "unknow" : inputName.current.value;

    FC.donate(id, name, new Date().toLocaleDateString(), {
      value: ethers.utils.parseEther(amount),
    }).then(() => {
      FC.on("donateSuccess", (amount_, donorName_, donorAddr_, donateTime_) => {
        setCurFund(parseFloat(curFund + amount_ / 10 ** 18).toFixed(2));
        setDonateAmount([...donateAmount, amount_]);
        setDonorName([...donorName, donorName_]);

        setDonorsAddr([...donorsAddr, donorAddr_]);

        setDonateTime([...donateTime, donateTime_]);
      });
    });
  }

  async function beGuarantor() {
    FC.getGuaranted().then((res) => {
      let gid = parseInt(res);
      if (gid != 0) {
        if (gid === id) {
          alert("您已经为该项目的担保人！请勿重复操作");
        } else {
          alert("您已有担保项目，不可再担保此项目！");
        }
        return;
      } else {
        FC.beGuarantor(id).then(async () => {
          FC.on("beGuarantorSuccess", (newGurantor) => {
            setGuarantors([...guarantors, newGurantor]);
          });
        });
      }
    });
  }

  async function setAccount() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    setCurAccount(accounts[0]);
  }

  async function updateMaxFunds() {
    const newFund = parseFloat(inputFund.current.value);
    if (newFund > maxFunds || newFund <= 0) {
      alert("您输入的金额有误，请重新输入！");
      return;
    }
    FC.updateMaxFunds(id, newFund).then(() => {
      FC.on("updateMaxFundsSuccess", (newAmount) => {
        setNeedFund(parseFloat(newAmount));
      });
    });
  }

  return (
    <>
      <Narbar />
      <div class="container" style={{ paddingTop: "50px" }}>
        <div class="row">
          <div class="col-md-8">
            <h1>{info._name}</h1>
            <div>
              <div class="embed-responsive embed-responsive-16by9">
                <iframe
                  class="embed-responsive-item"
                  src={info._videoUrl}
                ></iframe>
              </div>

              <h3>项目进度</h3>
              <div class="progress">
                <div
                  class={`progress-bar ${
                    curFund >= needFund ? "progress-bar-success" : ""
                  }`}
                  role="progressbar"
                  aria-valuenow="60"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{
                    width: `${(curFund * 100) / needFund}%`,
                    minWidth: "2em",
                  }}
                >
                  {parseInt((curFund * 100) / needFund)}%
                </div>
              </div>

              <div class="well well-lg">
                <div class="row" style={{ "text-align": "center" }}>
                  <span class="col-md-3">
                    <strong class="text-success">已筹集金额</strong>
                    <h3
                      class="text-success"
                      style={{ "font-weight": "bolder" }}
                    >
                      {curFund} ETH
                    </h3>
                  </span>
                  <span class="col-md-3">
                    <strong class="text-danger">目标金额</strong>
                    <h3 class="text-danger" style={{ "font-weight": "bolder" }}>
                      {needFund} ETH
                    </h3>
                  </span>
                  <span class="col-md-3">
                    <strong class="text-primary">捐款次数</strong>
                    <h3
                      class="text-primary"
                      style={{ "font-weight": "bolder" }}
                    >
                      {donorsAddr.length}次
                    </h3>
                  </span>
                  <span class="col-md-3">
                    <strong class="text-primary">剩余天数</strong>
                    <h3
                      class="text-primary"
                      style={{ "font-weight": "bolder" }}
                    >
                      {parseInt(
                        (parseInt(info._deadline) - curTime) /
                          24 /
                          60 /
                          60 /
                          1000
                      )}
                      天
                    </h3>
                  </span>
                </div>
              </div>

              <h3>项目描述</h3>
              <p>{info._simpleDscr}</p>
            </div>
            <div style={{ "padding-top": "10px" }}>
              <div class="panel panel-info">
                {/* <!-- Default panel contents --> */}
                <div class="panel-heading" style={{ "text-align": "center" }}>
                  <h4 style={{ "font-weight": "bolder" }}>捐款人名单</h4>
                </div>

                {/* <!-- Table --> */}
                <table class="table">
                  <tbody>
                    <tr>
                      <th>捐款人姓名</th>
                      <th>捐款人地址</th>
                      <th>捐款金额</th>
                      <th>捐款时间</th>
                    </tr>
                    {donorsAddr.map((address, index) => {
                      return (
                        <tr>
                          <td>{donorName[index]}</td>
                          <td>{address}</td>
                          <td>
                            {parseFloat(donateAmount[index] / 10 ** 18)}ETH
                          </td>
                          <td>{donateTime[index]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <h1>
              {String(info._owner).toLowerCase() === curAccount
                ? "更改目标金额"
                : "支持该项目"}
            </h1>
            {
              <div class="panel panel-default">
                <div class="panel-body">
                  <form>
                    {String(info._owner).toLowerCase() === curAccount ? (
                      <>
                        <div class="form-group">
                          <label for="amount">更新额度</label>
                          <div class="input-group">
                            <input
                              ref={inputFund}
                              type="number"
                              class="form-control"
                              max={maxFunds}
                              step="0.1"
                              min="0.1"
                              placeholder={`您的额度最高为 ${maxFunds} ETH`}
                            ></input>
                            <span class="input-group-addon">ETH</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            updateMaxFunds();
                          }}
                          type="button"
                          class="btn btn-success"
                          style={{ width: "100%" }}
                        >
                          更新
                        </button>
                      </>
                    ) : (
                      <>
                        <div class="form-group">
                          <label for="name">姓名</label>
                          <input
                            ref={inputName}
                            type="text"
                            name="name"
                            class="form-control"
                            id="name"
                            placeholder="请输入您的姓名"
                          ></input>
                        </div>

                        <div class="form-group">
                          <label for="amount">捐赠金额</label>
                          <div class="input-group">
                            <input
                              ref={inputDonote}
                              type="number"
                              class="form-control"
                              max={maxDonate}
                              step="0.01"
                              min="0.1"
                              placeholder={`您最高可捐赠 ${maxDonate} ETH`}
                            ></input>
                            <span class="input-group-addon">ETH</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            donate();
                          }}
                          type="button"
                          class="btn btn-primary"
                          style={{ width: "100%" }}
                        >
                          捐赠
                        </button>
                        <div style={{ textAlign: "center" }}>或者</div>
                        <button
                          onClick={() => beGuarantor()}
                          type="button"
                          class="btn btn-success"
                          style={{ width: "100%" }}
                        >
                          成为该项目担保人
                        </button>
                      </>
                    )}
                  </form>
                </div>
              </div>
            }

            <div class="panel panel-warning">
              <div class="panel-heading">
                <h3 class="panel-title">温馨提醒</h3>
              </div>
              <div class="panel-body">
                若该众筹项目存在欺诈行为，请点击
                <a
                  onClick={() => {
                    alert(String(info._owner).toLowerCase() === curAccount);
                  }}
                >
                  举报
                </a>
              </div>
            </div>

            <div class="panel panel-info">
              {/* <!-- Default panel contents --> */}
              <div class="panel-heading" style={{ "text-align": "center" }}>
                <strong>项目担保人名单( {guarantors.length} 人)</strong>
              </div>
              <div class="panel-body">
                {guarantors.map((guarantor) => {
                  return (
                    <p class="text-info" style={{ "font-weight": "bolder" }}>
                      {guarantor}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
