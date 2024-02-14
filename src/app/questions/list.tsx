import { Answer, InputOption, QuestionAnswer } from "./interfaces";
import {
  Badge,
  Card,
  Col,
  Grid,
  List,
  ListItem,
  Metric,
  MultiSelect,
  MultiSelectItem,
  SearchSelect,
  SearchSelectItem,
  Select,
  SelectItem,
  TextInput,
  Textarea,
  Title,
} from "@tremor/react";
import { RenderEditQuestion, RenderQuestion } from "./question";
import { isEmpty, sortBy, uniq, uniqBy } from "lodash";

import { MinusCircleIcon } from "@heroicons/react/20/solid";
import React from "react";
import _get from "lodash/get";

interface ListQuestionsProps {}
interface ListQuestionsState {
  selectedQuestion: QuestionAnswer | null;
  questions: QuestionAnswer[];
  search: string;
}

export interface UseQuestions {
  search: string;
  selectedQuestion?: QuestionAnswer;
  questions: QuestionAnswer[];
  handleChangeAnswer: (answer: Answer) => void;
  handleSaveQuestion: (question: QuestionAnswer) => void;
  clearSearch: () => void;
  handleSearch: (search: string) => void;
  setSelectedQuestion: (question: QuestionAnswer) => void;

  getAllQuestions: () => Promise<QuestionAnswer[]>;
  // readQuestion: (question: QuestionAnswer) => Promise<void>;
  getFilteredQuestions: () => QuestionAnswer[];
}

export const useQuestions = (): UseQuestions => {
  const [state, setState] = React.useState<ListQuestionsState>({
    selectedQuestion: null,
    questions: [],
    search: "",
  });

  const { selectedQuestion = null, questions = [], search } = state;

  const handleSearch = (search: string) => {
    setState({ ...state, search });
  };

  const clearSearch = () => {
    setState({ ...state, search: "" });
  };

  const getFilteredQuestions = () => {
    let filteredQuestions = questions.filter(
      (item) =>
        item &&
        item.question &&
        (item.question.question.toLowerCase() || "").includes(
          search.toLowerCase()
        )
    );

    filteredQuestions = sortBy(filteredQuestions, "isNew");
    return sortBy(filteredQuestions, "date");
  };

  const setSelectedQuestion = (question: QuestionAnswer) => {
    setState({
      ...state,
      selectedQuestion: question,
      questions: questions.map((item) => {
        if (item?.question?.inputId === question?.question?.inputId) {
          return question;
        }
        return item;
      }),
    });
    handleSaveQuestion(question);
  };

  const setSelectedAnswerText = (answer: string) => {
    const selQuestion = {
      ...selectedQuestion,
      chainRes: { text: answer },
      isNew: false,
    };
    setSelectedQuestion(selQuestion);
  };

  const handleChangeAnswer = (answer: Answer) => {
    // console.log("handleChangeAnswer answer", {
    //   ...answer,
    // });

    if (!selectedQuestion) return;
    if (!answer) return;
    const isCheckbox = answer.inputType === "checkbox";

    const questionInputType = _get(
      selectedQuestion,
      "question.inputType",
      "text"
    );

    const questionInputTypeValue = _get(
      selectedQuestion,
      "question.inputTypeValue",
      ""
    );

    const answerInputId = _get(answer, "inputId", "");

    const questionAnswerText = _get(selectedQuestion, "chainRes.text", "");

    // console.log("handleChangeAnswer answer", {
    //   ...answer,
    //   isCheckbox,
    //   questionInputType,
    // });

    switch (questionInputType) {
      case "fieldset":
        if (isCheckbox) {
          let questionAnswerTextJson: string[] = null;
          try {
            questionAnswerTextJson = JSON.parse(questionAnswerText);
          } catch (error) {}

          // console.log("questionAnswerTextJson answer", {
          //   questionAnswerTextJson,
          // });

          if (questionAnswerTextJson && Array.isArray(questionAnswerTextJson)) {
            // new format
            if (
              questionAnswerTextJson.includes(answer.inputId) ||
              questionAnswerTextJson.includes(answer.answerText)
            ) {
              questionAnswerTextJson = questionAnswerTextJson
                .filter((item) => item !== answer.inputId)
                .filter((item) => item !== answer.answerText);
            } else {
              const curAnswer = answerInputId.replace('"', "").replace('"', "");

              questionAnswerTextJson.push(curAnswer);
            }
            const newAnswerText = JSON.stringify(questionAnswerTextJson);
            return setSelectedAnswerText(newAnswerText);
          } else {
            const curAnswer = questionAnswerText
              .replace('"', "")
              .replace('"', "");
            const newAnswerText = JSON.stringify([curAnswer]);
            return setSelectedAnswerText(newAnswerText);
          }
        }
        return setSelectedAnswerText(answer.inputId);

      default:
        return setSelectedAnswerText(answer.answerText);
    }
  };

  const getAllQuestions = async () => {
    try {
      let questionsApi = await (window as any).api.invoke("questions:getall");

      // console.log("questionsApi", questionsApi);

      // questionsApi = JSON.parse(questionsApi);

      if (questionsApi) {
        questionsApi = questionsApi.filter(
          (item: QuestionAnswer) =>
            item && item.question && item.question.inputId
        );

        questionsApi = uniqBy(questionsApi, "question.inputId");

        if (questionsApi.length) {
          setState({ ...state, questions: questionsApi });
        }
      }

      return questionsApi;
    } catch (error) {}
  };

  React.useEffect(() => {
    getAllQuestions();
  }, []);

  const handleSaveQuestion = async (selQuestion: QuestionAnswer) => {
    const questToSave: QuestionAnswer = {
      ...selQuestion,
      chainRes: {
        ...selQuestion.chainRes,
        error: false,
      },
      isNew: false,
    };

    const saveQuestion = await (window as any).api.invoke(
      "questions:save",
      questToSave
    );

    // const allquestions = questions.map((item) => {
    //   if (item.question.inputId === selectedQuestion.question.inputId) {
    //     return questToSave;
    //   }
    //   return item;
    // });

    // setState({ ...state, questions: allquestions });

    // await getAllQuestions();
    return saveQuestion;
  };

  const filteredQuestions = getFilteredQuestions();

  return {
    search,
    handleSearch,
    clearSearch,
    selectedQuestion,
    questions: state.questions,
    handleChangeAnswer,
    handleSaveQuestion,
    setSelectedQuestion,
    getFilteredQuestions,
    getAllQuestions,
  };
};

export const ListQuestions = () => {
  const {
    handleSaveQuestion,
    getFilteredQuestions,
    selectedQuestion = null,
    questions = [],
    search,
    handleSearch,
    clearSearch,
    setSelectedQuestion,
    handleChangeAnswer,
    getAllQuestions,
  } = useQuestions();

  React.useEffect(() => {
    getAllQuestions();
  }, []);

  const filteredQuestions = getFilteredQuestions();

  return (
    <Card className="w-full">
      <Title>Questions {questions.length}</Title>
      <div className="flex flex-row">
        <div className="flex mt-3 flex-col" style={{ width: "50%" }}>
          <div className="flex rounded-md shadow-sm mb-2 relative">
            <input
              value={search}
              name="search"
              id="search"
              //   disabled={disabled}
              className="h-10 block w-full rounded-md border border-gray-200 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder=" Search by name..."
              spellCheck={false}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {!isEmpty(search) && (
              <div
                className="absolute right-1 top-0 bottom-0 flex items-center justify-center cursor-pointer"
                onClick={() => clearSearch()}
              >
                <MinusCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>

          <List
            style={{
              height: "80vh",
              overflowY: "scroll",
            }}
          >
            {filteredQuestions.map((item) => {
              const selectedQuesId = _get(selectedQuestion, "question.inputId");
              const currentQuesId = _get(item, "question.inputId");
              const isSelected = selectedQuesId === currentQuesId;
              return (
                <ListItem
                  onClick={() => setSelectedQuestion(item as QuestionAnswer)}
                  key={item.question.inputId}
                  className={` hover:bg-gray-100 cursor-pointer px-2 ${
                    isSelected ? "bg-gray-200" : ""
                  }`}
                >
                  <Title className="truncate">{item.question.question}</Title>
                  {item.isNew && <Badge>New</Badge>}
                </ListItem>
              );
            })}
          </List>
        </div>

        {selectedQuestion && (
          <div
            style={{ height: "70vh", width: "50%" }}
            className="flex flex-col overflow-x-scroll p-2"
          >
            <div style={{ marginBottom: "20px" }}>
              <Metric>{selectedQuestion.question.question}</Metric>
            </div>

            <div>
              <RenderQuestion
                handleChangeAnswer={handleChangeAnswer}
                question={selectedQuestion}
              />
            </div>

            {/* <div className="flex justify-center mt-2">
              <button
                onClick={() => handleSaveQuestion(selectedQuestion)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div> */}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ListQuestions;
