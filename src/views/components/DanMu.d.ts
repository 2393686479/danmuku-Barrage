import { type CSSProperties } from 'vue'
export interface danmuStyle extends CSSProperties {
    "--opacity"?: string;
    "--fontSize": string;
    "--color"?: string;
    "--translateX": string;
    "--duration": string;
    "--top": string;
}

export interface danmuItemProps {
    id: string;
    style: danmuStyle;
    content: string;
    trackIndex: number
}


export interface danmuItem{
    id: string,
    isRolled: boolean, // 一个弹幕是否已经全部出屏幕右边了
    isEnd: boolean // 一个弹幕是否已经全部出屏幕左边了
}