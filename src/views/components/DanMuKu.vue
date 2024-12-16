<template>
  <div class="danmu-container" ref="container">
    <dan-mu
      v-for="(item, index) in danmuData"
      :key="item.id"
      :ref="(el) => setComponentRef(el, item.id)"
      :id="item.id"
      :style="item.style"
      :content="item.content"
      :track-index="item.trackIndex"
      :is-paused="item.isPaused"
      :is-end="item.isEnd"
      @animation-end="animationEnd"
    />
  </div>
  <div @click="addDanmu">增加弹幕</div>
  <div @click="paused">暂停弹幕</div>
</template>
<script setup lang="ts">
import { type danmuItemProps, type danmuItem } from "./DanMu";
import DanMu from "./DanMu.vue";
import { onMounted, ref, watch } from "vue";
import { getTextWidth, getTranslateXValue } from "@/utils/index";

// 弹幕Refs
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
// 数据
const list = ref<danmuItemProps[]>([]);
// 添加弹幕按钮
const addDanmu = () => {
  list.value.push({
    id: Math.random() * 10 + "",
    style: {
      "--fontSize": "25px",
    },
    content: "ssssssssss",
  });
};
const paused = () => {
  danmuData.value = danmuData.value.map((item) => {
    item.isPaused = true;
    return item;
  });
};
const initList = () => {
  setInterval(() => {
  list.value.push({
    id: Math.random() * 10 + "",
    style: {
      "--fontSize": "25px",
    },
    content: "ssssssssss",
  });
  }, 1000);
};

const container = ref<HTMLDivElement>();
// 弹幕数据
const danmuData = ref<danmuItemProps[]>([]);

onMounted(() => {
  initList();
  // 计算容纳多少个轨道
  const tracksCount = Math.floor(container.value!.offsetHeight / trackHeight);
  initTrack(tracksCount);
});

watch(
  () => list,
  (newVal) => {
    if (!isCleaning.value) {
      findIsEndItem(handleDanmuData(newVal.value[newVal.value.length - 1]));
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

// 标记，防止执行watch方法里面的操作
const isCleaning = ref<boolean>(false);
// 处理数据, 将数据放在合适的轨道，组装成弹幕数据
const handleDanmuData = (danmuDataItem: danmuItemProps): danmuItemProps => {
  const elWidth = getTextWidth(
    danmuDataItem.content,
    danmuDataItem.style["--fontSize"],
  );
  const distance = window.innerWidth + elWidth;
  const obj: danmuItemProps = {
    id: "",
    content: "",
    style: {
      "--fontSize": "",
    },
  };

  let trackIndex = 0;
  // 加入轨道
  for (trackIndex = 0; trackIndex < tracksArray.length; trackIndex++) {
    const track: danmuItem[] = tracksArray[trackIndex];
    // console.log("轨道为", trackIndex, "弹幕Id为", item.id);
    if (track.length > 0) {
      // 计算这条轨道最后一个弹幕是否全部进入屏幕
      let lastItem = track[track.length - 1];

      // 如果最后一个弹幕已经走完了
      if (lastItem.isEnd) {
        // 弹出已经走完的弹幕
        isCleaning.value = true;
        track.pop();
        isCleaning.value = false;
      }

      // 弹出走完的弹幕后，如果该轨道没有弹幕了，直接push
      if (track.length === 0) {
        track.push({
          id: danmuDataItem.id,
          isEnd: false,
          width: elWidth,
        });
        break;
      }

      let translateXValue: number | undefined = 0;
      const lastDanmuInstance = itemRefs.value[lastItem.id];
      // console.log("最后一个item", lastDanmuInstance.$el);
      translateXValue = getTranslateXValue(lastDanmuInstance.$el);
      // 保证上一个弹幕已经完全进入屏幕
      if (translateXValue && -1 * translateXValue > lastItem.width) {
        // console.log("上一个弹幕已全部进入屏幕，放入第", trackIndex, "个轨道");
        track.push({
          id: danmuDataItem.id,
          isEnd: false,
          width: elWidth,
        });
        break;
      }
    } else {
      // console.log("id为", item.id, "的弹幕直接放进轨道");
      track.push({
        id: danmuDataItem.id,
        isEnd: false,
        width: elWidth,
      });
      break;
    }
  }
  obj.id = danmuDataItem.id;
  obj.style = {
    "--translateX": -distance + "px",
    "--duration": distance / speed + "s",
    "--top": trackIndex * trackHeight + "px",
    "--fontSize": "25px",
  };
  obj.content = danmuDataItem.content;
  obj.trackIndex = trackIndex;
  obj.isPaused = false;
  obj.isEnd = false;
  return obj;
};

// 利用isEnd复用dom
const findIsEndItem = (danmuDataItem: danmuItemProps) => {
  isCleaning.value = true;
  console.log("findIsEndItem", danmuDataItem, danmuData.value);
  const item = danmuData.value.find((item) => item.isEnd);
  if (item) {
    Object.assign(item, danmuDataItem);
  } else {
    danmuData.value.push(danmuDataItem);
    console.log("findIsEndItem没找到isEnd为true", danmuData.value);
  }
  isCleaning.value = false;
};

const animationEnd = (id: string, trackIndex: number) => {
  const track = tracksArray[trackIndex];
  setItemEnd(track, id);
  setItemEnd(danmuData.value, id);
};

const setItemEnd = (array: danmuItem[] | danmuItemProps[], id: string) => {
  const item = array.find((item) => item.id === id);
  if (item) {
    item.isEnd = true;
  }
};
</script>
<style lang="scss" scoped>
.danmu-container {
  margin-top: 100px;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 520px;
  position: relative;
  background-color: black;
}
</style>
