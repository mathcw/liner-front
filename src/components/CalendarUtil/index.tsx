import React from 'react';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Row, Col, Checkbox, Calendar, Divider, DatePicker, Modal, message } from 'antd';
import moment from 'moment';

import styles from './index.less';

interface IUtilProp{
    title:string,
    width:string | number;
    visible:boolean
    onOk?:(dateArr:string[]) => void;
    onCancel?:() => void;
}

interface IUtilState {
    tab: number,
    dateArr: string[],
    page: number,
    everyDays: {
        start: string,
        end: string,
        dateArr: string[]
    },
    weekly: {
        start: string,
        end: string,
        dayOfWeek: any[],
        dateArr: string[]
    }
}

const InitState = () =>{
    const Init:IUtilState = {
        tab: 1,
        dateArr: [],
        page: 0,
        everyDays: { start: '', end: '', dateArr: [] },
        weekly: { start: '', end: '', dayOfWeek: [], dateArr: [] },
    };
    return Init;
}

class Util extends React.Component<IUtilProp, IUtilState> {
    readonly state = InitState();
    startDate: moment.Moment = moment();
    calendarsNum: number = 4;

    selectDate = (date?:moment.Moment) => {
        if(date){
            const dateString = date.format('YYYY-MM-DD');
            let { dateArr } = this.state;
            if (dateArr.indexOf(dateString) === -1) {
                dateArr.push(dateString);
            } else {
                dateArr.splice(dateArr.indexOf(dateString), 1);
            }
            this.setState({dateArr})
        }
    };

    dateFullCellRender = (date:moment.Moment, calendar:any) => {
        const { dateArr } = this.state;
        let addClass = 'ant-calendar-date multdate ';
        if (dateArr.indexOf(date.format('YYYY-MM-DD')) !== -1) {
            addClass = styles.selected;
            return <div className={addClass}>{date.date()}</div>;
        }
        return <div>{date.date()}</div>;
    };

    renderCalendarList = () => {
        const arr = [];
        const { page } = this.state;
        for (let i = 0; i < this.calendarsNum; i += 1) {
            let start:moment.Moment = moment();;
            if (i === 0 && page === 0) {
                start = moment(`${moment(this.startDate).format('YYYY-MM-DD')}`);
            } else {
                start = moment(
                    `${moment(this.startDate)
                        .add(page * this.calendarsNum + i, 'months')
                        .startOf('month')}`
                );
            }
            const end = moment(moment(start).endOf('month'));
            const range:[moment.Moment, moment.Moment] = [start, end];

            arr.push({ val: start, range });
        }
        return arr.map(item => (
            <Col style={{ width: 300 }} key={item.val.toString()}>
                <Calendar
                    fullscreen={false}
                    defaultValue={item.val}
                    validRange={item.range}
                    headerRender={() => {
                        return <div className={styles.calendarHeader}>{item.val.format('YYYY-MM')}</div>;
                    }}
                    dateFullCellRender={date => this.dateFullCellRender(date, item)}
                    onSelect={this.selectDate}
                />
            </Col>
        ));
    };

    changeTab = (tab:number) => {
        this.setState({ tab });
    };

    // 批量天天开团
    onEveryDaysChange = (type:|'start'|'end', date?:moment.Moment|null) => {
        const { everyDays } = this.state;
        if (date) {
            everyDays[type] = date.format('YYYY-MM-DD');
            this.setState({ everyDays });
        } else {
            everyDays[type] = '';
            this.setState({ everyDays });
        }
    };

    onWeeklyChange = (type:|'start'|'end', date?:moment.Moment|null) => {
        const { weekly } = this.state;
        if (date) {
            weekly[type] = date.format('YYYY-MM-DD');
            this.setState({ weekly });
        } else {
            weekly[type] = '';
            this.setState({ weekly });
        }
    };

    startDateDisabled = (type:|'everyDays'|'weekly', current?:moment.Moment|null) => {
        const date = this.state[type];
        const now = moment();
        if(!current) return false;
        return (
            current &&
            !current.isBetween(
                now.subtract(1, 'd').format('YYYY-MM-DD'),
                date.end ? moment(date.end).add(1, 'd') : '2100-12-31',
                'day'
            )
        );
    };

    endDateDisabled = (type:|'everyDays'|'weekly', current?:moment.Moment|null) => {
        const date = this.state[type];
        if(!current) return false;
        return current && current.isBefore(date.start || this.startDate);
    };

    onModalOk = () =>{
        const { onOk } = this.props;
        if(onOk){
            const dateArr = this.promptAndDateArr();
            if(dateArr){
                onOk(dateArr);
            }
        }
    }

    onModalCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) {
            onCancel();
        }
    };

    afterClose = () =>{
        this.setState({ ...InitState() });
    }

    plusPage = () => {
        let { page } = this.state;
        page -= 1;
        this.setState({ page });
    };

    minusPage = () => {
        let { page } = this.state;
        page += 1;
        this.setState({ page });
    };

    // 按周开团
    changeWeek = (checkedValue:any) => {
        const { weekly } = this.state;
        weekly.dayOfWeek = checkedValue;
        this.setState({ weekly });
    };

    // 按周开团 最后返回的日期数组
    endWeekReturnArr = () => {
        const { weekly } = this.state;
        const endArr = [];
        const week = {
            1: '星期一',
            2: '星期二',
            3: '星期三',
            4: '星期四',
            5: '星期五',
            6: '星期六',
            0: '星期日',
        };
        // numDays是start到end的天数 包括start但是不包括end, start <= x < end
        const numDays = moment(weekly.end).diff(moment(weekly.start), 'days');
        for (let i = 0; i < numDays; i += 1) {
            const days = moment(weekly.start).add(i, 'd');
            const isPush = weekly.dayOfWeek.includes(week[days.day()]);
            if (isPush) {
                endArr.push(days.format('YYYY-MM-DD'));
            }
        }
        return endArr;
    };

    // 计算最后的天数数组和确认时的提示信息
    promptAndDateArr = () => {
        const { tab, dateArr, everyDays, weekly } = this.state;
        if (tab === 1) {
            if(dateArr.length === 0){
                message.error('请选择日期!');
                return false;
            }
            return dateArr;
        }
        if (tab === 2) {
            const allDaysArr = [];
            if (!everyDays.start) {
                message.error('请选择开始日期!');
                return false
            }
            if (!everyDays.end) {
                message.error('请选择结束日期!');
                return false
            }
            // numallDaysNumDays是start到end的天数 包括start但是不包括end, start <= x < end(但是需要选中的日期也选上,所以用<=,这样就等于多加了一个最后一天,就对了)
            const allDaysNum = moment(everyDays.end).diff(moment(everyDays.start), 'days');
            for (let i = 0; i <= allDaysNum; i += 1) {
                const days = moment(everyDays.start)
                    .add(i, 'd')
                    .format('YYYY-MM-DD');
                allDaysArr.push(days);
            }
            return allDaysArr
        }
        if (!weekly.start) {
            message.error('请选择开始日期!');
            return false
        }
        if (!weekly.end) {
            message.error('请选择结束日期!');
            return false
        }
        if (weekly.dayOfWeek.length === 0) {
            message.error('请选择周几开团!');
            return false
        }
        return this.endWeekReturnArr();
    };

    render() {
        const { tab } = this.state;
        const week = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
        const { title, visible, width } = this.props;
        return (
            <Modal
                title={title}
                width={width || 520}
                visible={visible}
                onCancel={this.onModalCancel}
                onOk={this.onModalOk}
                afterClose={this.afterClose}
                bodyStyle={{padding:0}}
            >
                <Col className={styles.BatchOpen}>
                    <Col className={styles.tabBox}>
                        <div
                            className={[styles.tabItem, tab === 1 ? styles.active : ''].join(' ')}
                            onClick={() => this.changeTab(1)}
                        >
                            固定日期开团
                        </div>
                        <div
                            className={[styles.tabItem, tab === 2 ? styles.active : ''].join(' ')}
                            onClick={() => this.changeTab(2)}
                        >
                            批量天天开团
                        </div>
                        <div
                            className={[styles.tabItem, tab === 3 ? styles.active : ''].join(' ')}
                            onClick={() => this.changeTab(3)}
                        >
                            按周循环开团
                        </div>
                    </Col>
                    <Divider style={{ margin: 0 }} />
                    {/* 固定日期开团 */}
                    <Row
                        gutter={8}
                        justify="space-between"
                        className={[styles.calendarsBox, tab !== 1 ? 'hide' : ''].join(' ')}
                    >
                        {this.renderCalendarList()}
                        <LeftCircleOutlined className={styles.pervPage} onClick={() => this.plusPage()} />
                        <RightCircleOutlined className={styles.nextPage} onClick={() => this.minusPage()} />
                    </Row>
                    {/* 批量天天开团 */}
                    <Row className={[tab !== 2 ? 'hide' : '', styles.everyDays].join(' ')}>
                        <Col className={styles.DatePicker}>
                            <span>开始日期：</span>
                            <DatePicker
                                getPopupContainer={(triggerNode: Element) => triggerNode as HTMLElement}
                                onChange={date => this.onEveryDaysChange('start', date)}
                                disabledDate={current => this.startDateDisabled('everyDays', current)}
                            />
                        </Col>
                        <Divider style={{ margin: 0 }} />
                        <Col className={styles.DatePicker}>
                            <span>结束日期：</span>
                            <DatePicker
                                getPopupContainer={(triggerNode: Element) => triggerNode as HTMLElement}
                                onChange={date => this.onEveryDaysChange('end', date)}
                                disabledDate={current => this.endDateDisabled('everyDays', current)}
                            />
                        </Col>
                        <Divider style={{ margin: 0 }} />
                    </Row>
                    {/* 按周循环开团 */}
                    <Row className={[tab !== 3 ? 'hide' : '', styles.weekOpen].join(' ')}>
                        <Col className={styles.date} span={24}>
                            <Col span={9}>
                                <span>开始日期：</span>
                                <DatePicker
                                    getPopupContainer={(triggerNode: Element) => triggerNode as HTMLElement}
                                    onChange={date => this.onWeeklyChange('start', date)}
                                    disabledDate={current => this.startDateDisabled('weekly', current)}
                                />
                            </Col>
                            <Col span={9}>
                                <span>结束日期：</span>
                                <DatePicker
                                    getPopupContainer={(triggerNode: Element) => triggerNode as HTMLElement}
                                    onChange={date => this.onWeeklyChange('end', date)}
                                    disabledDate={current => this.endDateDisabled('weekly', current)}
                                />
                            </Col>
                        </Col>
                        <Divider style={{ margin: 0 }} />
                        <Col className={styles.weeks}>
                            <Checkbox.Group
                                options={week}
                                defaultValue={[]}
                                onChange={checkedValue => this.changeWeek(checkedValue)}
                            />
                        </Col>
                        <Divider style={{ margin: 0 }} />
                    </Row>
                </Col>
            </Modal>
        );
    }
}

export default Util;
