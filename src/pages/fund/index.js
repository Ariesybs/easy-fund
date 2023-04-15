import Narbar from "\u0016\u0016@component/components/Navbar";
import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
export default function fund() {
  const [FC, setFC] = useState(null);
  const [maxFund, setMaxFund] = useState(0);
  const [videoFile, setVideoFile] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [fundName, setFundName] = useState("项目名称");
  const [simpleDesc, setSimpleDesc] = useState("项目简述");
  const [description, setDescription] = useState("");
  const [needFund, setNeedFund] = useState(0);
  const [dealLine, setDealLine] = useState(null);

  useEffect(() => {
    const crowdfunding = require("../../../build/contracts/crowdfunding.json");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const FContract = new ethers.Contract(
      crowdfunding.networks[5777].address,
      JSON.stringify(crowdfunding.abi),
      signer
    );
    // FContract.isRegister().then((res) => {
    //   if (!res) {
    //     window.location.href = "/";
    //   }
    // });
    FContract.getMaxFund().then((res) => {
      setMaxFund(parseInt(res));
    });
    setFC(FContract);
  }, []);

  async function createFund() {
    if (
      videoFile === "" ||
      imgFile === "" ||
      fundName === "" ||
      simpleDesc === "" ||
      dealLine === null
    ) {
      alert("请将表单填写完整!");
      return;
    }
    if (needFund > maxFund || needFund <= 0) {
      alert("非法金额！");
      return;
    }
    if (!confirm("确认发起众筹？")) {
      return;
    }
    const client = create("http://localhost:5002");
    const imgCid = (await client.add(imgFile)).cid;
    const imgUrl = "http://localhost:9090/ipfs/" + imgCid.toString();
    const videoCid = (await client.add(videoFile)).cid;
    const videoUrl = "http://localhost:9090/ipfs/" + videoCid.toString();
    FC.createItem(
      fundName,
      needFund,
      dealLine,
      simpleDesc,
      description,
      imgUrl,
      videoUrl
    ).then(() => {
      FC.on("createItemSuccess", () => {
        alert("项目创建成功");
      });
    });
  }
  return (
    <>
      <Narbar />

      <div
        className="container"
        style={{ paddingTop: "30px", paddingBottom: "50px" }}
      >
        <div className="page-header">
          <h1>发起众筹</h1>
        </div>
        <div className="row">
          <div className="col-md-6">
            <form action="" method="post">
              <div className="form-group">
                <label for="name">
                  <span style={{ color: "red" }}>*</span>项目名称
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  onChange={(e) => {
                    setFundName(e.target.value);
                  }}
                  placeholder="请输入众筹名称"
                ></input>
              </div>
              <div className="form-group">
                <label for="intro">项目描述</label>
                <textarea
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="form-control"
                  name="intro"
                  rows="3"
                  placeholder="请输入项目详细描述"
                ></textarea>
              </div>
              <div className="form-group">
                <label for="simple-intro">
                  <span style={{ color: "red" }}>*</span>项目简述
                </label>
                <textarea
                  className="form-control"
                  name="simple-intro"
                  rows="3"
                  onChange={(e) => {
                    setSimpleDesc(e.target.value);
                  }}
                  placeholder="请输入项目简单描述"
                ></textarea>
              </div>
              <div className="form-group">
                <label for="image">
                  <span style={{ color: "red" }}>*</span>封面图片
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => {
                    setImgFile(e.target.files[0]);
                  }}
                  placeholder="请选择封面图片"
                ></input>
              </div>
              <div className="form-group">
                <label for="video">
                  <span style={{ color: "red" }}>*</span>介绍视频
                </label>
                <input
                  id="videoInput"
                  type="file"
                  name="video"
                  onChange={(e) => {
                    setVideoFile(e.target.files[0]);
                  }}
                  placeholder="请选择介绍视频"
                ></input>
              </div>
              <div className="embed-responsive embed-responsive-16by9">
                <iframe
                  className="embed-responsive-item"
                  id="previewVideo"
                  src={videoFile !== "" ? URL.createObjectURL(videoFile) : ""}
                ></iframe>
              </div>
              <div className="form-group">
                <label for="name">
                  <span style={{ color: "red" }}>*</span>目标金额
                </label>
                <div className="input-group">
                  <input
                    onChange={(e) => {
                      setNeedFund(e.target.value);
                    }}
                    type="number"
                    step={0.1}
                    min={0}
                    max={maxFund}
                    className="form-control"
                    name="target"
                    placeholder={`请输入目标金额，您最多可设置${maxFund}ETH`}
                  ></input>
                  <span class="input-group-addon">ETH</span>
                </div>
              </div>
              <div className="form-group">
                <label for="expire">
                  <span style={{ color: "red" }}>*</span>截止日期
                </label>
                <input
                  onChange={(e) => {
                    setDealLine(new Date(e.target.value).getTime());
                  }}
                  type="date"
                  className="form-control"
                  name="expire"
                  placeholder="请输入众筹截止日期"
                ></input>
              </div>
            </form>
          </div>

          <div className="col-md-4">
            <div className="panel panel-success">
              <div className="panel-heading">温馨提示</div>
              <div className="panel-body">
                项目列表填写完毕后，请点击下方预览卡中的
                <strong>发起众筹</strong>按钮
              </div>
            </div>

            <div className="panel panel-info">
              <div className="panel-heading">项目</div>
              <div className="panel-body">
                <img
                  src={imgFile !== "" ? URL.createObjectURL(imgFile) : ""}
                  className="img-responsive"
                  style={{ width: "100%" }}
                  alt="Image"
                ></img>
                <h3>{fundName}</h3>

                <p className="well well-sm">{simpleDesc}</p>
                <div className="progress">
                  <div
                    className="progress-bar "
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: "10%", " min-width": "2em" }}
                  >
                    10%
                  </div>
                </div>
                <p>
                  <a
                    onClick={() => {
                      createFund();
                    }}
                    className="btn btn-primary"
                    role="button"
                    style={{ width: "100%" }}
                  >
                    发起众筹
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
