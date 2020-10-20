import axios from 'axios';
import { put, takeLatest, takeEvery } from 'redux-saga/effects';

function* createQuestion(action) {
  const res = yield axios({
    method: 'POST',
    url: '/api/question',
    data: action.payload.question
  });

  yield put({
    type: 'FETCH_QUESTIONS'
  });

  action.payload.onCreate(res.data);
}

function* fetchQuestions(action) {
  const res = yield axios({
    method: 'GET',
    url: '/api/question'
  });

  yield put({
    type: 'SET_QUESTIONS',
    payload: res.data
  });
}

function* userSaga() {
  yield takeLatest('FETCH_QUESTIONS', fetchQuestions);
  yield takeEvery('CREATE_QUESTION', createQuestion);
}

export default userSaga;
