import { Row, Col, Menu, Dropdown } from "antd";
import React from "react";
import { DownOutlined } from "@ant-design/icons";
import styles from './style.less';
import { IModBtn } from "@/viewconfig/ModConfig";

const Btns = (btns: IModBtn[], item: any, load: () => void,style?:React.CSSProperties) => {
    if (btns.length === 1) {
        const btn = btns[0];
        return (
            <Row style={style?{...style}:{}}>
                <Col>
                    <a className={styles.aStyle} onClick={e => {
                        e.preventDefault();
                        if (btn.onClick) btn.onClick(item, load);
                    }
                    }>{btn.text || ""}</a>
                </Col>
            </Row>
        )
    } else if (btns.length > 1) {
        const btn = btns[0];
        const menu = <Menu>
            {btns.map((btnItem, index) => (
                <Menu.Item key={btnItem.authority}
                    onClick={() => {
                        if (btnItem.onClick) btnItem.onClick(item, load);
                    }}
                >
                    {btnItem.text || ""}
                </Menu.Item>
            ))}
        </Menu>
        return (
            <Row style={style?{...style}:{}}>
                <Col span={10}>
                    <a className={styles.aStyle} onClick={e => {
                        e.preventDefault();
                        if (btn.onClick) btn.onClick(item, load);
                    }
                    }>{btn.text || ""}</a>
                </Col>
                <Col span={12} style={{ textAlign: 'center' }}>
                    <Dropdown overlay={menu}
                        getPopupContainer={(triggerNode: Element) => triggerNode as HTMLElement}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            更多 <DownOutlined />
                        </a>
                    </Dropdown>
                </Col>
            </Row>
        )
    }

    return null;
}

export default Btns;