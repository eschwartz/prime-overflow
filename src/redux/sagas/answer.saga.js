import axios from 'axios';
import { put, takeLatest, takeEvery } from 'redux-saga/effects';

function* createAnswer(action) {
  yield axios({
    method: 'POST',
    url: '/api/answer',
    data: action.payload
  });

  yield put({
    type: 'FETCH_ANSWERS',
  });
}
function* fetchAnswers() {
  let res = yield axios({
    method: 'GET',
    url: '/api/answer'
  });

  yield put({
    type: 'SET_ANSWERS',
    payload: res.data
  });
}

function* userSaga() {
  yield takeLatest('FETCH_ANSWERS', fetchAnswers);
  yield takeEvery('CREATE_ANSWER', createAnswer);
}

export default userSaga;
