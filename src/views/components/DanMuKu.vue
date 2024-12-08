<template>
  <div class="danmu-container" ref="container">
    <dan-mu
      v-for="(item, index) in danmuData"
      :ref="(el) => setComponentRef(el, item.id)"
      :id="item.id"
      :style="item.style"
      :content="item.content"
      :trackIndex="item.trackIndex"
      @animation-end="animationEnd"
    />
  </div>
</template>
<script setup lang="ts">
import { type danmuItemProps, type danmuItem } from "./DanMu";
import DanMu from "./DanMu.vue";
import { nextTick, onMounted, ref } from "vue";
import { getTextWidth, getTranslateXValue } from "@/utils/index";

const itemRefs = ref<Record<string, InstanceType<typeof DanMu>>>({});

const setComponentRef = (
  el: InstanceType<typeof DanMu> | null,
  id: string
): undefined => {
  if (el) {
    itemRefs.value[id] = el;
  }
};
// 轨道高度
const trackHeight = 30;
// 轨道
const tracksArray: danmuItem[][] = [];

// 速度
const speed = 200;

const list: Record<string, any>[] = [];

// 创建数据
for (let index = 0; index < 2; index++) {
  setTimeout(() => {
    list.push({
      id: index.toString(),
      style: {
        "--fontSize": "25px",
      },
      content: "我是弹幕我是弹幕我是弹幕我是弹幕",
    });
  }, 2000);
}

const container = ref<HTMLDivElement>();
const danmuData = ref<danmuItemProps[]>([]);
onMounted(() => {
  // 计算容纳多少个轨道
  const tracksCount = Math.floor(container.value!.offsetHeight / trackHeight);
  initTrack(tracksCount);
  danmuData.value = handleDanmuData(tracksCount);
});

// 初始化轨道
function initTrack(tracksCount: number) {
  for (let index = 0; index < tracksCount; index++) {
    tracksArray[index] = [];
  }
}

// 处理数据
function handleDanmuData(tracksCount: number): danmuItemProps[] {
  return list.map((item) => {
    const randomTrack = Math.floor(Math.random() * tracksCount);
    const eleWidth = getTextWidth(item.content, item.style["--fontSize"]);
    const distance = window.innerWidth + eleWidth;
    const obj: danmuItemProps = {
      id: item.id,
      style: {
        "--translateX": -distance + "px",
        "--duration": distance / speed + "s",
        "--top": randomTrack * trackHeight + "px",
        "--fontSize": "25px",
      },
      content: item.content,
      trackIndex: 0,
    };

    // 加入轨道
    for (let index = 0; index < tracksArray.length; index++) {
      const track: danmuItem[] = tracksArray[index];
      if (track.length) {
        const lastItem = track[track.length - 1];
        console.log("lastItem", lastItem);
        nextTick(() => {
          const danmuInstance: InstanceType<typeof DanMu> =
            itemRefs.value[lastItem.id];
          const a = getTranslateXValue(danmuInstance.$el);
          console.log("zxzzzzzzzzz", item.id, danmuInstance.$el);
        });

        if (lastItem.isRolled) {
          track.push({
            id: obj.id,
            isRolled: false,
            isEnd: false,
          });
        }
      } else {
        track.push({
          id: obj.id,
          isRolled: false,
          isEnd: false,
        });
      }
      obj.trackIndex = index;
    }
    return obj;
  });
}

const animationEnd = (id: string, trackIndex: number) => {
  const track = tracksArray[trackIndex];
  track.forEach((item) => {
    if (item.id === id) {
      item.isEnd = true;
    }
  });
};
</script>
<style lang="scss" scoped>
.danmu-container {
  margin-top: 100px;
  width: 100vw;
  height: 500px;
  position: relative;
  background-color: black;
}
</style>
