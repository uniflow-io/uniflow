import { COMMIT_SET_PAGE, COMMIT_SET_THEME } from "./actions-types"

export const commitSetPage = (page) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_PAGE,
      page,
    })
    return Promise.resolve()
  }
}

export const commitSetTheme = (theme) => {
  return async (dispatch) => {
    dispatch({
      type: COMMIT_SET_THEME,
      theme,
    })
    return Promise.resolve()
  }
}

export const switchTheme = (oldTheme) => {
  return async (dispatch) => {
    let theme = "light"
    if (oldTheme === "light") {
      theme = "dark"
    } else if (oldTheme === "dark") {
      theme = "sepia"
    } else if (oldTheme === "sepia") {
      theme = "light"
    }

    localStorage.setItem("theme", JSON.stringify(theme))

    return dispatch(commitSetTheme(theme))
  }
}

export const applyTheme = () => {
  return async (dispatch) => {
    const theme = JSON.parse(localStorage.getItem("theme")) || "light"

    return dispatch(commitSetTheme(theme))
  }
}
