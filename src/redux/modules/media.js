const FEEDTAB = 'FEEDTAB'
const CONTENT = 'CONTENT'
const COLUMN = 'COLUMN'
const FEEDCOLUMN = 'FEEDCOLUMN'
const COLUMNCONTENT = 'COLUMNCONTENT'

const initialState = {
  view: FEEDTAB
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FEEDTAB:
      return {
        ...state,
        view: FEEDTAB
      }
    case COLUMN:
      return {
        ...state,
        view: COLUMN
      }
    case CONTENT:
      return {
        ...state,
        view: CONTENT
      }
    default:
      return state
  }
}

export function tabSwitch() {
  return {
    type: FEEDTAB
  }
}

export function columnSwitch() {
  return {
    type: COLUMN
  }
}

export function contentSwitch() {
  return {
    type: CONTENT
  }
}
