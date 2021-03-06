import {
  pathOr,
  sum,
  length,
  keys,
  head,
  map,
  max,
  prop,
	propOr,
	has
} from 'ramda'
import pastaTypes from '@root/src/shared/constants/pastaTypes'
import {
  INFERENCE,
  CB,
  CPU,
  LED
} from '@root/src/shared/constants/deviceTypes'
import moment from 'moment'

export default {
  getAverageDeviceData(state, getters) {
    return (deviceData) => {
      return pathOr(0, [getters.getSelectedBoard, deviceData.id, deviceData.dbField], state.averageDeviceData) / getters.getHistoryCount
    }
  },
  getAverageCPUData(state, getters) {
    return (field) => pathOr(0, [getters.getSelectedBoard, CPU.id, field], state.averageDeviceData) / getters.getHistoryCount
  },
  getSelectedBoard(state, getters) {
    if (state.selectedBoard) return state.selectedBoard
    if (!length(state.allBoard)) return 'None'
    return head(getters.getAllBoards)
  },
  getBoardAlias(state) {
		return (boardId) => pathOr(`Board-${boardId}`, [boardId, 'alias'], state.allBoard)
	},
  getLastUpateTime(state, getters) {
    const utcTime = pathOr(null, [getters.getSelectedBoard, 'last-updated-time'], state.allBoard)
    if (utcTime) {
      const date = moment.utc(utcTime).format('YYYY-MM-DD HH:mm:ss')
      const stillUtc = moment.utc(date).toDate()
      const local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss')
      return local
    }
    return 'Not Get Data'
  },
  getDeviceHistory(state, getters) {
    return (deviceData) => {
      return pathOr([{
        x: 0,
        y: 0
      }], [getters.getSelectedBoard, deviceData.id], state.deviceStatusHistory).slice()
    }
  },
  getHistoryCount(state, getters) {
    return pathOr(1, [getters.getSelectedBoard, 'log-count'], state.allBoard)
  },
  getPastaCount(state, getters) {
    return map((pasta) => pathOr(0, [getters.getSelectedBoard, pasta.sId, 'pasta-count'], state.lastPastaData), pastaTypes)
  },
  getAveragePastaCount(state, getters) {
    return map((pasta) => pathOr(0, [getters.getSelectedBoard, pasta.sId, 'pasta-count'], state.averagePastaData), pastaTypes)
  },
  getMQTTData(state, getters) {
    return prop(getters.getSelectedBoard, state.mqttDatas)
  },
  getInferenceConfident(state, getters) {
    return map((pasta) => pathOr(0, [getters.getSelectedBoard, pasta.sId, 'confidence'], state.averagePastaData) /
      max(1, pathOr(1, [getters.getSelectedBoard, pasta.sId, 'pasta-count'], state.averagePastaData)), pastaTypes
    )
  },
  getAverageConfidence(state, getters) {
    return sum(getters.getInferenceConfident) / 4.0
  },
  getInferenceTimeCount(state, getters) {
    return max(1, pathOr(1, [getters.getSelectedBoard, INFERENCE.id, 'inference-time-count'], state.averageDeviceData))
  },
  deviceStatus(state, getters) {
    return has(getters.getSelectedBoard, state.cntNotReceived) ? prop(getters.getSelectedBoard, state.cntNotReceived) < 2 : -1
  },
  deviceStatusByBoardID(state) {
		return (boardId) => {
			return has(boardId, state.cntNotReceived) ? propOr(0, boardId, state.cntNotReceived) < 2 : -1
		}
  },
  getPastaCountInMin(state, getters) {
    return sum(getters.getAveragePastaCount) * 30 / getters.getInferenceTimeCount
  },
  getAllBoards(state) {
    return keys(state.allBoard)
  },
  getBeltSpeed(state, getters) {
    return pathOr(0, [getters.getSelectedBoard, CB.id, 'speed'], state.lastDeviceData)
  },
  getLedBrightness(state, getters) {
    return pathOr(0, [getters.getSelectedBoard, LED.id, 'brightness'], state.lastDeviceData)
  },
}
