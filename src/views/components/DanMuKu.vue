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
import { nextTick, onMounted, ref, watch } from "vue";
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

watch(() => list);

// 初始化轨道
function initTrack(tracksCount: number) {
  for (let index = 0; index < tracksCount; index++) {
    tracksArray[index] = [];
  }
}

// 处理数据
function handleDanmuData(tracksCount: number): danmuItemProps[] {
  return list.map((item) => {
    // const randomTrack = Math.floor(Math.random() * tracksCount);
    const elWidth = getTextWidth(item.content, item.style["--fontSize"]);
    const distance = window.innerWidth + elWidth;
    const obj: danmuItemProps = {};
    // 加入轨道
    for (let index = 0; index < tracksArray.length; index++) {
      const track: danmuItem[] = tracksArray[index];
      if (track.length) {
        // 计算这条轨道最后一个弹幕是否全部进入屏幕
        const lastItem = track[track.length - 1];
        let translateXValue: number | undefined = 0;
        nextTick(() => {
          const lastDanmuInstance: InstanceType<typeof DanMu> =
            itemRefs.value[lastItem.id];
          translateXValue = getTranslateXValue(lastDanmuInstance.$el);
        });
        // 如果上一个弹幕已经全部进入屏幕
        if (translateXValue && translateXValue > lastItem.width) {
          track.push({
            id: item.id,
            isRolled: false,
            isEnd: false,
            width: elWidth,
          });
        } else {
          continue;
        }
      } else {
        track.push({
          id: item.id,
          isRolled: false,
          isEnd: false,
          width: elWidth,
        });
      }
      obj.id = item.id;
      obj.style = {
        "--translateX": -distance + "px",
        "--duration": distance / speed + "s",
        "--top": index * trackHeight + "px",
        "--fontSize": "25px",
      };
      obj.content = item.content;
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
