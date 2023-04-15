import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Fcontract } from "\u0016\u0016@component/contract";
import { CSSTransition } from "react-transition-group";
import { arrayify } from "ethers/lib/utils";
export default function Item(props) {
  const FC = props.FC;
  const [id, setID] = useState();
  const [info, setInfo] = useState("");
  useEffect(() => {
    setID(props.id);
    FC.getItemById(props.id).then((data) => {
      setInfo(data);
    });
  }, []);

  return (
    <div>
      <div class="col-sm-4">
        <div class="panel panel-primary">
          <div class="panel-heading">项目{parseInt(info._id)}</div>
          <div class="panel-body">
            <CSSTransition in={true} classNames={"image"} timeout={1000} appear>
              <img
                src={info._imgUrl}
                class="img-responsive"
                style={{ width: "100%", height: "200px" }}
                alt="Image"
              ></img>
            </CSSTransition>

            <h3>{info._name}</h3>

            <p>{info._simpleDscr}</p>
            <div class="progress">
              <div
                class={`progress-bar ${
                  parseFloat(info._currentFunds) >=
                  parseFloat(info._needFunds) * 10 ** 18
                    ? "progress-bar-success"
                    : ""
                }`}
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{
                  width: `${
                    (info._currentFunds * 100) / 10 ** 18 / info._needFunds
                  }%`,
                  "min-width": "2em",
                }}
              >
                {parseInt(
                  (info._currentFunds * 100) / 10 ** 18 / info._needFunds
                )}
                %
              </div>
            </div>
            <p>
              <Link
                href={`/details/${props.id}`}
                class="btn btn-primary"
                role="button"
              >
                查看详情
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
