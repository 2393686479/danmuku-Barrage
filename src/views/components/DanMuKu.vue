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
  <div @click="addDanmu">增加弹幕</div>
</template>
<script setup lang="ts">
import { type danmuItemProps, type danmuItem } from "./DanMu";
import DanMu from "./DanMu.vue";
import { nextTick, onMounted, ref, watch } from "vue";
import { getTextWidth, getTranslateXValue } from "@/utils/index";

const itemRefs = ref<Record<string, InstanceType<typeof DanMu>>>({});

const setComponentRef = (
  el: InstanceType<typeof DanMu> | null,
  id: string,
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

const list = ref<Record<string, any>[]>([]);

// 创建数据
list.value.push({
  id: "0",
  style: {
    "--fontSize": "25px",
  },
  content: "我是弹幕我是弹幕我是弹幕我是弹幕",
});
list.value.push({
  id: "1",
  style: {
    "--fontSize": "25px",
  },
  content: "我是弹幕我是弹幕我是弹幕我是弹幕",
});

const addDanmu = () => {
  list.value.push({
    id: Math.random() * 10 + "",
    style: {
      "--fontSize": "25px",
    },
    content: "ssssssssss",
  });
};

const container = ref<HTMLDivElement>();
const danmuData = ref<danmuItemProps[]>([]);
onMounted(async () => {
  // 计算容纳多少个轨道
  const tracksCount = Math.floor(container.value!.offsetHeight / trackHeight);
  initTrack(tracksCount);
  danmuData.value = handleDanmuData(list.value);
});

watch(
  () => list,
  (newVal) => {
    if (!isClean.value) {
      danmuData.value = danmuData.value.concat(
        handleDanmuData([newVal.value[newVal.value.length - 1]]),
      );
    }
  },
  {
    deep: true,
  },
);

// 初始化轨道
function initTrack(tracksCount: number) {
  console.log("tracksCount", tracksCount);
  for (let index = 0; index < tracksCount; index++) {
    tracksArray[index] = [];
  }
}

const isClean = ref<boolean>(false);

// 处理数据
function handleDanmuData(list: Record<string, any>[]): danmuItemProps[] {
  return list.map((item) => {
    const elWidth = getTextWidth(item.content, item.style["--fontSize"]);
    const distance = window.innerWidth + elWidth;
    const obj: danmuItemProps = {};

    let trackIndex = 0;
    // 加入轨道
    for (trackIndex = 0; trackIndex < tracksArray.length; trackIndex++) {
      const track: danmuItem[] = tracksArray[trackIndex];
      console.log("轨道为", trackIndex, "弹幕Id为", item.id);
      if (track.length !== 0) {
        // 计算这条轨道最后一个弹幕是否全部进入屏幕
        let lastItem = track[track.length - 1];

        // 循环判断：如果最后一个弹幕已经走完了
        while (track.length >= 1 && lastItem.isEnd) {
          // 弹出已经走完的弹幕
          lastItem = track[track.length - 1];
          track.pop();
          isClean.value = true;
        }
        isClean.value = false;
        // 弹出走完的弹幕后，该轨道没有弹幕了，直接push
        if (track.length === 0) {
          track.push({
            id: item.id,
            isEnd: false,
            width: elWidth,
          });
          break;
        }

        let translateXValue: number | undefined = 0;
        let lastDanmuInstance: InstanceType<typeof DanMu>;
        // 获取上一个弹幕走的路程
        nextTick(() => {
          lastDanmuInstance = itemRefs.value[lastItem.id];
          console.log("ssssssssssss", itemRefs.value[lastItem.id]);
        }).then(() => {
          translateXValue = getTranslateXValue(lastDanmuInstance.$el);
          console.log(
            "获取上一个弹幕走的路程",
            lastItem.id,
            translateXValue,
            lastItem.width,
          );
          console.log("fffffffffff", trackIndex);
          // 如果上一个弹幕已经全部进入屏幕，就放入该轨道
          if (translateXValue && -1 * translateXValue > lastItem.width) {
            console.log(
              "上一个弹幕已全部进入屏幕，放入第",
              trackIndex,
              "个轨道",
            );
            track.push({
              id: item.id,
              isEnd: false,
              width: elWidth,
            });
          }
        });
      } else {
        console.log("id为", item.id, "的弹幕直接放进轨道");
        track.push({
          id: item.id,
          isEnd: false,
          width: elWidth,
        });
        break;
      }
    }
    obj.id = item.id;
    obj.style = {
      "--translateX": -distance + "px",
      "--duration": distance / speed + "s",
      "--top": trackIndex * trackHeight + "px",
      "--fontSize": "25px",
    };
    obj.content = item.content;
    obj.trackIndex = trackIndex;
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
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 500px;
  position: relative;
  background-color: black;
}
</style>
