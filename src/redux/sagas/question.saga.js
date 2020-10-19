import axios from 'axios';
import { put, takeLatest, takeEvery, select } from 'redux-saga/effects';

function* createQuestion(action) {
  const res = yield axios({
    method: 'POST',
    url: '/api/question',
    data: action.payload.question
  });

  yield put({
    type: 'FETCH_QUESTIONS'
  });

  yield put({
    type: 'SET_ACTIVE_QUESTION',
    payload: res.data
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

function* saveDraftQuestion() {
  // Grab the draft question from the store
  const draftQuestion = yield select(store => store.draftQuestion);

  if (draftQuestion === null) {
    console.warn(`Attempting to save null draftQuestion. Aborting`);
    return;
  }

  // Call the API, to save it
  yield axios({
    method: 'PUT',
    url: `/api/question/${draftQuestion.id}`,
    data: draftQuestion
  });

  // Reload questions from server
  yield put({
    type: 'FETCH_QUESTIONS'
  });
}

function* userSaga() {
  yield takeLatest('FETCH_QUESTIONS', fetchQuestions);
  yield takeEvery('CREATE_QUESTION', createQuestion);
  yield takeEvery('SAVE_DRAFT_QUESTION', saveDraftQuestion);
}

export default userSaga;
