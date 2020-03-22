import { sys } from "@/utils/core";

export const dict = {
  Business: {
    1:'价格类型',
    2:'客房类型'
  },
  YesNo: { 0: '不允许', 1: '允许' },
  State: { 0: '停用', 1: '启用' },
  Gender: { 0: '男', 1: '女' },
  HaveNo: { 0: '无', 1: '有' },

  Continent: { AF: '非洲', EU: '欧洲', AS: '亚洲', OA: '大洋洲', NA: '北美洲', SA: '南美洲', AN: '南极洲' },
  CountryBelong: { AO: 'AF', AF: 'AS', AL: 'EU', DZ: 'AF', AD: 'EU', AI: 'SA', AG: 'NA', AR: 'SA', AM: 'AS', AU: 'OA', AT: 'EU', AZ: 'AS', BS: 'NA', BH: 'AS', BD: 'AS', BB: 'NA', BY: 'EU', BE: 'EU', BZ: 'NA', BJ: 'AF', BM: 'NA', BO: 'SA', BW: 'AF', BR: 'SA', BN: 'AS', BG: 'EU', BF: 'AF', MM: 'AS', BI: 'AF', CM: 'AF', CA: 'NA', CF: 'AF', TD: 'AF', CL: 'SA', CN: 'AS', CO: 'SA', CG: 'AF', CK: 'OA', CR: 'NA', CU: 'NA', CY: 'AS', CZ: 'EU', DK: 'EU', DJ: 'AF', DO: 'NA', EC: 'SA', EG: 'AF', SV: 'NA', EE: 'EU', ET: 'AF', FJ: 'OA', FI: 'EU', FR: 'EU', GF: 'SA', GA: 'AF', GM: 'AF', GE: 'AS', DE: 'EU', GH: 'AF', GI: 'EU', GR: 'EU', GD: 'NA', GU: 'OA', GT: 'NA', GN: 'AF', GY: 'SA', HT: 'NA', HN: 'NA', HK: 'AS', HR: 'EU', HU: 'EU', IS: 'EU', IN: 'AS', ID: 'AS', IR: 'AS', IQ: 'AS', IE: 'EU', IL: 'AS', IT: 'EU', JM: 'NA', JP: 'AS', JO: 'AS', KH: 'AS', KZ: 'AS', KE: 'AF', KR: 'AS', KW: 'AS', KG: 'AS', LA: 'AS', LV: 'EU', LB: 'AS', LS: 'AF', LR: 'AF', LY: 'AF', LI: 'EU', LT: 'EU', LU: 'EU', MO: 'AS', MG: 'AF', MW: 'AF', MY: 'AS', MV: 'AS', ML: 'AF', MT: 'EU', MU: 'AF', MX: 'NA', MD: 'EU', MC: 'EU', MN: 'AS', MS: 'NA', MA: 'AF', MZ: 'AF', NA: 'AF', NR: 'OA', NP: 'AS', NL: 'EU', NZ: 'OA', NI: 'NA', NE: 'AF', NG: 'AF', KP: 'AS', NO: 'EU', OM: 'AS', PK: 'AS', PA: 'NA', PG: 'OA', PY: 'SA', PE: 'SA', PH: 'AS', PL: 'EU', PF: 'OA', PT: 'EU', PR: 'NA', QA: 'AS', RO: 'EU', RU: 'EU', LC: 'NA', VC: 'SA', SM: 'EU', ST: 'AF', SA: 'AS', SN: 'AF', SC: 'AF', SL: 'AF', SG: 'AS', SK: 'EU', SI: 'EU', SB: 'OA', SO: 'AF', ZA: 'AF', ES: 'EU', LK: 'AS', SD: 'AF', SR: 'SA', SZ: 'AF', SE: 'EU', CH: 'EU', SY: 'AS', TW: 'AS', TJ: 'AS', TZ: 'AF', TH: 'AS', TG: 'AF', TO: 'OA', TT: 'NA', TN: 'AF', TR: 'AS', TM: 'AS', UG: 'AF', UA: 'EU', AE: 'AS', GB: 'EU', US: 'NA', UY: 'SA', UZ: 'AS', VE: 'SA', VN: 'AS', YE: 'AS', YU: 'EU', ZW: 'AF', ZR: 'AF', ZM: 'AF' },
  Country: { AD: "安道尔共和国", AE: "阿拉伯联合酋长国", AF: "阿富汗", AG: "安提瓜和巴布达", AI: "安圭拉岛", AL: "阿尔巴尼亚", AM: "亚美尼亚", AO: "安哥拉", AR: "阿根廷", AT: "奥地利", AU: "澳大利亚", AZ: "阿塞拜疆", BB: "巴巴多斯", BD: "孟加拉国", BE: "比利时", BF: "布基纳法索", BG: "保加利亚", BH: "巴林", BI: "布隆迪", BJ: "贝宁", BM: "百慕大群岛", BN: "文莱", BO: "玻利维亚", BR: "巴西", BS: "巴哈马", BW: "博茨瓦纳", BY: "白俄罗斯", BZ: "伯利兹", CA: "加拿大", CF: "中非共和国", CG: "刚果", CH: "瑞士", CK: "库克群岛", CL: "智利", CM: "喀麦隆", CN: "中国", CO: "哥伦比亚", CR: "哥斯达黎加", CU: "古巴", CY: "塞浦路斯", CZ: "捷克", DE: "德国", DJ: "吉布提", DK: "丹麦", DO: "多米尼加共和国", DZ: "阿尔及利亚", EC: "厄瓜多尔", EE: "爱沙尼亚", EG: "埃及", ES: "西班牙", ET: "埃塞俄比亚", FI: "芬兰", FJ: "斐济", FR: "法国", GA: "加蓬", GB: "英国", GD: "格林纳达", GE: "格鲁吉亚", GF: "法属圭亚那", GH: "加纳", GI: "直布罗陀", GM: "冈比亚", GN: "几内亚", GR: "希腊", GT: "危地马拉", GU: "关岛", GY: "圭亚那", HN: "洪都拉斯", HR: "克罗地亚", HT: "海地", HU: "匈牙利", ID: "印度尼西亚", IE: "爱尔兰", IL: "以色列", IN: "印度", IQ: "伊拉克", IR: "伊朗", IS: "冰岛", IT: "意大利", JM: "牙买加", JO: "约旦", JP: "日本", KE: "肯尼亚", KG: "吉尔吉斯坦", KH: "柬埔寨", KP: "朝鲜", KR: "韩国", KW: "科威特", KZ: "哈萨克斯坦", LA: "老挝", LB: "黎巴嫩", LC: "圣卢西亚", LI: "列支敦士登", LK: "斯里兰卡", LR: "利比里亚", LS: "莱索托", LT: "立陶宛", LU: "卢森堡", LV: "拉脱维亚", LY: "利比亚", MA: "摩洛哥", MC: "摩纳哥", MD: "摩尔多瓦", MG: "马达加斯加", ML: "马里", MM: "缅甸", MN: "蒙古", MS: "蒙特塞拉特岛", MT: "马耳他", MU: "毛里求斯", MV: "马尔代夫", MW: "马拉维", MX: "墨西哥", MY: "马来西亚", MZ: "莫桑比克", NA: "纳米比亚", NE: "尼日尔", NG: "尼日利亚", NI: "尼加拉瓜", NL: "荷兰", NO: "挪威", NP: "尼泊尔", NR: "瑙鲁", NZ: "新西兰", OM: "阿曼", PA: "巴拿马", PE: "秘鲁", PF: "法属玻利尼西亚", PG: "巴布亚新几内亚", PH: "菲律宾", PK: "巴基斯坦", PL: "波兰", PR: "波多黎各", PT: "葡萄牙", PY: "巴拉圭", QA: "卡塔尔", RO: "罗马尼亚", RU: "俄罗斯", SA: "沙特阿拉伯", SB: "所罗门群岛", SC: "塞舌尔", SD: "苏丹", SE: "瑞典", SG: "新加坡", SI: "斯洛文尼亚", SK: "斯洛伐克", SL: "塞拉利昂", SM: "圣马力诺", SN: "塞内加尔", SO: "索马里", SR: "苏里南", ST: "圣多美和普林西比", SV: "萨尔瓦多", SY: "叙利亚", SZ: "斯威士兰", TD: "乍得", TG: "多哥", TH: "泰国", TJ: "塔吉克斯坦", TM: "土库曼斯坦", TN: "突尼斯", TO: "汤加", TR: "土耳其", TT: "特立尼达和多巴哥", TZ: "坦桑尼亚", UA: "乌克兰", UG: "乌干达", US: "美国", UY: "乌拉圭", UZ: "乌兹别克斯坦", VC: "圣文森特岛", VE: "委内瑞拉", VN: "越南", YE: "也门", YU: "南斯拉夫", ZA: "南非", ZM: "赞比亚", ZR: "扎伊尔", ZW: "津巴布韦" },
  CNProvince: {
    1: '北京市', 2: '天津市', 3: '河北省', 4: '山西省', 5: '内蒙古自治区', 6: '辽宁省', 7: '吉林省', 8: '黑龙江省', 9: '上海市', 10: '江苏省',
    11: '浙江省', 12: '安徽省', 13: '福建省', 14: '江西省', 15: '山东省', 16: '河南省', 17: '湖北省', 18: '湖南省', 19: '广东省', 20: '广西壮族自治区',
    21: '海南省', 22: '重庆市', 23: '四川省', 24: '贵州省', 25: '云南省', 26: '西藏自治区', 27: '陕西省', 28: '甘肃省', 29: '青海省', 30: '宁夏回族自治区',
    31: '新疆维吾尔自治区', 32: '台湾省', 33: '香港特别行政区', 34: '澳门特别行政区'
  },

  PublishState: { 0: '未发布', 1: '已发布' },
  TrafficKind: { 1: '单程', 2: '往返' },
  Range: { 1: '国内', 2: '国际' },
  PlanType: { 1: '直飞', 2: '转机' },
  StarLevel: { 1: '一星',2:'二星',3:'三星',4:'四星',5:'五星',6:'六星',7:'七星' },
  PlusDay: { 1: '+1', 2: '+2' },
  ExtraBed: { 0: '不可', 1: '可加' },
  HaveOrNot: { 0: '无', 1: '有' },

  Include: { 1: '不包含', 2: '包含' },
  Flow: { 0: '未进行', 1: '未提交', 2: '待审批', 3: '拒审批', 4: '已通过' },
  ChangeFlow: { 0: '变更未进行', 1: '变更未提交', 2: '变更待审批', 3: '变更被拒绝审批', 4: '变更已通过' },
  Opinion: { 0: '提交', 1: '通过', 2: '不通过', 3: '取消', 4: '撤销' },
  GroupState: { 1: '收客', 2: '截止', 3: '结算', 4: '暂停' },
  GroupStateEdit: { 1: '收客', 2: '截止', 4: '暂停' },
  ShelfState: { 1: '已上架', 2: '已下架' },

  OpenClose: { 0: '关闭', 1: '开启' },
  //日志类型
  LogType: {
    1: '创建',
    2: '修改',
    3: '启停',
    4: '删除',
    5: '废除',
  },

  BindState: { 0: '未绑定', 1: '待绑定', 2: '已绑定', 3: '拒绑定', 4: '待解绑', 5: '已解绑' },
  BindOpinion: {
    1: '绑定',
    2: '拒回'
  },
  RoomType:{
    1: '套房',
    2: '阳台房',
    3: '海景房',
    4: '内舱房'
  },
  enum_ver: ""
};

export async function enumInit(ver: string) {
  const r = await fetch(`${sys.HOST}/files/TY_LINER/cache/Enum.js?ver=${ver}`);
  const rst = await r.json();

  Object.keys(rst).forEach(key => {
    dict[key] = rst[key];
  });
  dict.enum_ver = ver;
}

export interface IEnumCfg {
  type: string;
  cascade?: string;
  cascade2?: string;
  cascade3?: string;
  cascaded?: boolean;
  cascade_type?: string;
  mod?: string;
  text?: string;
}

export function searchChange(cfg: { [key: string]: IEnumCfg }, field: string, data: object) {
  const result = { ...data };
  const clearCascade = (checkField: string) => {
    let nField = null;
    Object.keys(cfg).forEach((key) => {
      if (cfg[key].cascade && (cfg[key].cascade === checkField
        || cfg[key].cascade2 === checkField || cfg[key].cascade3 === checkField)) {
        nField = key;
        result[key] = '';
      }
    })
    return nField;
  }
  let cField = clearCascade(field);
  while (cField) {
    cField = clearCascade(cField);
  }
  return result;
}

export function getEnum(
  cfg: string | IEnumCfg,
  row: object = {},
  pemField?: string | number
) {
  if (typeof cfg === "string") {
    return dict[cfg];
  }
  let rest = {};
  if (typeof cfg === "object") {
    if (!cfg.type) {
      return {};
    }
    // eslint-disable-next-line camelcase
    const { type } = cfg;
    rest = dict[type] || {};
    if (cfg.cascade) {
      const target = row[cfg.cascade];

      if (cfg.cascaded) {
        rest = rest[target] || {};
      } else {
        let cascadeSet = {};
        const result = {};
        if (cfg.cascade_type) {
          cascadeSet = dict[cfg.cascade_type];
        } else {
          switch (type) {
            case 'SupplierAccount':
              cascadeSet = dict['SupplierAccountCompany'];
              break;
            case 'Employee':
              cascadeSet = dict['EmployeeDep'];
              break;
            case 'Department':
              cascadeSet = dict['DepartmentDep'];
              break;
            case 'SupplierSales':
              cascadeSet = dict['SupplierSalesDep'];
              break;
            case 'SupplierDepartment':
              cascadeSet = dict['SupplierDepartmentDep'];
              break;
            case 'RetailerSales':
              cascadeSet = dict['RetailerSalesDep'];
              break;
            case 'RetailerDepartment':
              cascadeSet = dict['RetailerDepartmentDep'];
              break;
            case 'PrimaryNav':
              cascadeSet = dict['NavPdDirection'];
              break;
            case 'SecondaryNav':
              cascadeSet = dict['SecondaryNavBelong'];
              break;
            case 'City':
              cascadeSet = dict['CityCountry'];
              break;
            case 'CruiseShip':
              cascadeSet = dict['CruiseCompanyOfShip'];
              break;
            default:
              break;
          }
        }

        if (cascadeSet) {
          Object.keys(cascadeSet).forEach(k => {
            if (Array.isArray(target)) {
              if (target.includes(cascadeSet[k])) {
                if (rest[k]) {
                  result[k] = rest[k];
                }
              }
            } else if (target === cascadeSet[k]) {
              if (rest[k]) {
                result[k] = rest[k];
              }
            }
          });
        }

        rest = result;
      }
    }

    if (pemField) {
      const mod = (row && row["mod"]) || cfg.mod;
      const pemFilters = sys.filters;
      const pem = pemFilters[mod];
      const currentUser = sys.user;

      if (pem && pem[pemField]) {
        const filter = pem[pemField];
        const result = {};
        if (filter[0] === -1) {
          let target: string;
          switch (type) {
            case "Company":
            case "ManagerCompany":
              target = currentUser.company_id;
              break;
            case "Department":
            case "ManagerDepartment":
              target = currentUser.department_id;
              break;
            case "Employee":
            case "ManagerEmployee":
              target = currentUser.employee_id;
              break;
            default:
              break;
          }
          Object.keys(rest).forEach(k => {
            if (k === target) {
              result[k] = rest[k];
            }
          });
        } else {
          const restKeys = new Set(Object.keys(rest));
          const targetKeys = new Set(filter);
          const intersectionSet = new Set(
            [...restKeys].filter(x => targetKeys.has(x))
          );

          Object.keys(rest).forEach(k => {
            if (intersectionSet.has(k)) {
              result[k] = rest[k];
            }
          });
        }
        rest = result;
      }
    }
  }
  return rest;
}
