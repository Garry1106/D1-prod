"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatsCard;
const card_1 = require("@/components/ui/card");
function StatsCard({ title, value, description, icon: Icon, trend, }) {
    return (<card_1.Card>
      <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <card_1.CardTitle className="text-sm font-medium">{title}</card_1.CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground"/>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (<div className={`mt-2 text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isPositive ? '+' : '-'}
            {trend.value}%
          </div>)}
      </card_1.CardContent>
    </card_1.Card>);
}
