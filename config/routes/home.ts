import {IRouteValue} from '../routeConfig';
const routes:Array<IRouteValue> = [
    {
      parent: '/',
      routes: [
        {
          parent: '/',
          routes: [
            {path: '/home', component: './DashboardAnalysis'},
          ],
        }
      ],
    }
  ];

export default routes;