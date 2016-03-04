const SELECTED = 'SELECTED'
const CHANGESTATE = 'CHANGESTATE'
const CHANGEMODE = 'CHANGEMODE'

const initialState = {
  status: 'unread',
  mode: false
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGESTATE:
      return {
        ...state,
        status: action.change
      }
    case CHANGEMODE: {
      return {
        ...state,
        mode: !state.mode
      }
    }
    default:
      return state
  }
}

export function changeState(s) {
  return {
    type: CHANGESTATE,
    change: s
  }
}

export function changeMode() {
  return {
    type: CHANGEMODE
  }
}
