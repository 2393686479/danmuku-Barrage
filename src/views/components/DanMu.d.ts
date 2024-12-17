import { type CSSProperties } from 'vue'
export interface danmuStyle extends CSSProperties {
    "--opacity"?: string;
    "--fontSize": string;
    "--color"?: string;
    "--translateX"?: string;
    "--duration"?: string;
    "--top"?: string;
}

export interface danmuItemProps {
    id: string;
    style: danmuStyle;
    content: string;
    trackIndex?: number;
    isPaused?: boolean;
    isEnd?: boolean // 一个弹幕是否已经全部出屏幕
}


export interface trackDanmuItem{
    id: string,
    // isRolled: boolean, // 一个弹幕是否已经全部进入屏幕
    isEnd: boolean // 一个弹幕是否已经全部出屏幕
    width: number
}