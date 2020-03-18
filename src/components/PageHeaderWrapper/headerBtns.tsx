import React from "react";
import { Button, Modal } from "antd";
import { IModBtn } from "@/viewconfig/ModConfig";
import styles from "./index.less";

export default (btns: IModBtn[]) => (
  <div
    className={[styles.HeaderOperator, btns.length > 0 ? "" : "hide"].join(" ")}
  >
    {btns.map(btn => (
      <div key={btn.authority} className="dib">
        <Button
          type={btn.type}
          size={btn.size}
          onClick={() => {
            if (!btn.onClick) {
              Modal.error({
                title: `${btn.text}未配置`,
                content: `${btn.text}未配置`
              });
              return;
            }
            btn.onClick();
          }}
        >
          {btn.text || ""}
        </Button>
      </div>
    ))}
  </div>
);
