import asset from "../utils/asset";

const projects = [
  {
    name: "APS排产软件",
    description: "针对人工计划多工段规则复杂等问题，参与APS智能排产系统建设",
    url: "https://boxoking.github.io/boxoking-aj-aps-demo/#/schedule/forming",
    image: asset("images/aps-factory.jpeg"),
    hoverImage: asset("images/aps-demo-schedule.png"),
  },
  {
    name: "课题组科研协作平台",
    description:
      "针对论文版本分散、批注反馈低效、科研资料难以统一管理等问题，参与课题组论文审阅与知识协作平台建设。",
    image: asset("images/research-collaboration-base.jpg"),
    hoverImage: asset("images/research-collaboration-platform.png"),
    imageAlt: "课题组学术交流与科研协作现场",
    hoverImageAlt: "课题组科研协作平台论文审阅界面",
  },
];

export default projects;
