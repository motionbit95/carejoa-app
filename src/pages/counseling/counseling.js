import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Progress,
  ProgressLabel,
  Stack,
  Tag,
  TagCloseButton,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import BottomNavigation from "../../component/bottom_nav";
import Header from "../../component/header";
import SelectLocation from "../../component/select_location";
import { useNavigate } from "react-router-dom";

function Counseling(props) {
  const [tempAnswer, setTempAnswer] = React.useState(null);
  const [questions, setQuestions] = React.useState([
    {
      question: "선호하는 요양시설을 아래에서 선택해주세요.",
      answer: ["요양병원", "요양원", "주야간보호시설", "방문시설"],
      type: "select",
    },
    {
      question: "선호하는 지역을 선택해주세요.(3개까지 선택 가능)",
      type: "location",
    },
    {
      question: "선호하는 요양시설 등급을 입력해주세요.",
      answer: ["A등급", "B등급", "C등급이하", "상관없음"],
      type: "select",
    },
    {
      question: "선호하는 요양시설의 규모를 아래에서 선택해주세요.",
      answer: [
        "대형(100인 이상)",
        "중형(30~100인)",
        "소형(10~30인)",
        "치매전담형(16인 이하)",
      ],
      type: "select",
    },
    {
      question: "원하시는 비용 형태를 선택하세요.",
      answer: [
        "고급형(상급침실 비용 높음) ",
        "일반형(상급침실 비용 평균)",
        "실속형(상급침실 비용 낮음)",
        "상관없음",
      ],
      type: "select",
    },
    {
      question: "선호하는 요양 프로그램을 선택해주세요.",
      answer: [
        "운동보조",
        "인지기능향상",
        "종교활동",
        "재활특화",
        "치매특화",
        "맞춤형 서비스",
        "기타",
      ],
      type: "multi_select",
    },
    {
      question:
        "아래부터는 환자상태에 대하여 간단한 질문을 드립니다. 해당 내용에 답변해주세요.\n\n환자 성함을 입력해주세요.",
      placeholder: "어르신 성함",
      type: "text",
    },
    {
      question: "환자 연세를 선택해주세요.",
      answer: ["81세 이상", "71-80세", "65-70세", "64세 이하"],
      type: "select",
    },
    {
      question: "환자분의 노인장기요양등급을 선택해주세요.",
      answer: ["1등급", "2등급", "3등급", "4등급", "5등급", "인지등급", "모름"],
      type: "select",
    },
    {
      question: "혼자서 식사가 가능하신가요?",
      answer: ["도움없이 가능", "일부 도움 필요", "완전히 도움 필요"],
      type: "select",
    },
    {
      question: "혼자서 양치질이 가능하신가요?",
      answer: ["도움없이 가능", "일부 도움 필요", "완전히 도움 필요"],
      type: "select",
    },
    {
      question: "스스로 몸을 움직였을 때 불편하신 부분이 있으신가요?",
      answer: ["오른쪽 상체", "오른쪽 하체", "왼쪽 상체", "왼쪽 하체", "없음"],
      type: "select",
    },
    {
      question: "앓고 있는 질병이나 증상을 적어주세요.",
      placeholder:
        "암, 치매, 뇌졸증, 고혈압, 당뇨병, 관절염, 심부전, 폐질환...",
      type: "text",
    },
    {
      question:
        "가족/친지가 돌볼 수 있는 시간 외 나머지 지원이 필요한 간병 시간은 몇 시간 인가요?",
      answer: ["10~24시간", "3~10시간", "3시간 이내"],
      type: "select",
    },
    {
      question: "월 예산 간병비는 얼마인가요?",
      answer: [
        "월 30만원 이하",
        "월 30~50만원",
        "월 50~100만원",
        "월 100~150만원",
        "월 150~200만원",
        "월 200만원 이상",
      ],
      type: "select",
    },
    {
      question: "요양시설 경험이 있으신가요?",
      answer: ["있음", "없음"],
      type: "select",
    },
    {
      question: "요양시설 경험이 있으신가요?",
      answer: ["있음", "없음"],
      type: "select",
    },
    {
      question: "개인정보 수집 이용에 동의해주세요",
      subtitle:
        "상담 서비스 이용을 위한 개인정보 수집 및 제3자 제공에 확인하였으며 이에 동의됩니다.",
      answer: ["동의하고 상담 신청하기"],
      type: "select",
    },
  ]);

  const [answers, setAnswers] = React.useState([]);

  const [step, setStep] = React.useState(0);
  const [editQuestionIndex, setEditQuestionIndex] = React.useState(-1);
  const navigate = useNavigate();

  const submitCounseling = () => {
    console.log(answers);
    let data = {
      userId: "test", // 누가 신청했는지 알아야한다.
      createdAt: Date.now(), // 언제 신청했는지 알아야한다.
      state: 0, // 상담 요청
      questions: questions,
      answers: answers,
    };

    // 상담 저장
    const subCollection = "COUNSELING";

    fetch(
      `${process.env.REACT_APP_SERVER_URL}/saveDocument?subCollection=${subCollection}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        // 저장이 완료되었다는 알림을 발생시키고 페이지를 이동합니다.
        alert("상담신청이 완료되었습니다!");
        navigate("/counseling");
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // 부드러운 스크롤
    });
  }, [step]);

  return (
    <Stack bgColor={"gray.100"} minH={"100vh"} position={"relative"}>
      <Stack position={"sticky"} top={0} left={0} right={0} spacing={0}>
        <Header title={"상담신청"} />
        <HStack
          position={"sticky"}
          bgColor={"white"}
          w={"full"}
          justifyContent={"space-between"}
          p={4}
        >
          <Box w={"100%"}>
            <Progress
              w={"100%"}
              value={parseInt((step * 100) / questions.length)}
              colorScheme={"blue"}
            />
          </Box>
          <Text>{parseInt((step * 100) / questions.length)}%</Text>
        </HStack>
      </Stack>
      <Stack flex={1}>
        <Stack w={"full"} p={4}>
          {questions.map(
            (question, index) =>
              index <= step && (
                <>
                  <Stack>
                    <Stack
                      maxW={"80%"}
                      key={index}
                      bgColor={"white"}
                      borderRadius={"lg"}
                      borderTopLeftRadius={0}
                      p={4}
                    >
                      {/* 질문입니다. */}
                      <Stack>
                        <Text
                          whiteSpace={"pre-line"}
                          fontWeight={"bold"}
                          fontSize={"lg"}
                        >
                          {question.question}
                        </Text>
                        <Text whiteSpace={"pre-line"} fontSize={"sm"}>
                          {question.subtitle}
                        </Text>
                      </Stack>

                      {(!answers[index] || editQuestionIndex === index) && (
                        <>
                          {questions[index].type === "text" ? (
                            <Input
                              placeholder={questions[index].placeholder}
                              onChange={(e) => setTempAnswer([e.target.value])}
                            />
                          ) : questions[index].type === "location" ? (
                            <Stack>
                              <Wrap>
                                {tempAnswer?.map((answer, answerIndex) => (
                                  <WrapItem>
                                    <Tag size={"lg"}>
                                      {answer}
                                      <TagCloseButton
                                        onClick={() => {
                                          setTempAnswer(
                                            tempAnswer.filter(
                                              (item) => item !== answer
                                            )
                                          );
                                        }}
                                      />
                                    </Tag>
                                  </WrapItem>
                                ))}
                              </Wrap>
                              <SelectLocation
                                isDisabled={tempAnswer?.length >= 3}
                                defaultValue={"지역 선택하기"}
                                setLocation={(city, district) => {
                                  if (!tempAnswer) {
                                    setTempAnswer([city + " " + district]);
                                  } else {
                                    if (
                                      !tempAnswer.includes(
                                        city + " " + district
                                      )
                                    ) {
                                      setTempAnswer([
                                        ...tempAnswer,
                                        city + " " + district,
                                      ]);
                                    } else {
                                      setTempAnswer(
                                        tempAnswer.filter(
                                          (item) =>
                                            item !== city + " " + district
                                        )
                                      );
                                    }
                                  }
                                }}
                              />
                            </Stack>
                          ) : (
                            <Stack bgColor={"white"} borderRadius={"md"}>
                              {questions[index].answer?.map(
                                (answer, answerIndex) => (
                                  <Button
                                    variant={"outline"}
                                    key={answerIndex}
                                    textAlign={"left"}
                                    colorScheme={
                                      questions[index].type ===
                                        "multi_select" &&
                                      tempAnswer?.includes(answer)
                                        ? "blue"
                                        : "gray"
                                    }
                                    onClick={() => {
                                      console.log(index, answer);
                                      if (questions[index].type === "select") {
                                        answers[index] = answer;
                                        setAnswers([...answers]);
                                        setEditQuestionIndex(-1);
                                        if (step === questions.length - 1) {
                                          submitCounseling();
                                          return;
                                        }

                                        setStep(step + 1);
                                      } else if (
                                        questions[index].type === "multi_select"
                                      ) {
                                        if (!tempAnswer) {
                                          setTempAnswer([answer]);
                                        } else {
                                          if (!tempAnswer.includes(answer)) {
                                            setTempAnswer([
                                              ...tempAnswer,
                                              answer,
                                            ]);
                                          } else {
                                            setTempAnswer(
                                              tempAnswer.filter(
                                                (item) => item !== answer
                                              )
                                            );
                                          }
                                        }
                                        console.log(tempAnswer);
                                      }
                                    }}
                                  >
                                    {answer}
                                  </Button>
                                )
                              )}
                            </Stack>
                          )}
                          {questions[index].type !== "select" && (
                            <Button
                              isDisabled={!tempAnswer}
                              colorScheme="blue"
                              onClick={() => {
                                console.log(tempAnswer);
                                answers[index] = tempAnswer.join(", ");
                                setAnswers(answers);
                                setStep(step + 1);
                                setEditQuestionIndex(-1);
                                setTempAnswer(null);
                              }}
                            >
                              다음
                            </Button>
                          )}
                        </>
                      )}
                    </Stack>
                    {answers[index] && (
                      <Stack alignItems={"flex-end"}>
                        <Box
                          maxW={"80%"}
                          p={4}
                          w={"fit-content"}
                          bgColor={"gray.700"}
                          borderRadius={"lg"}
                          borderTopRightRadius={0}
                        >
                          <Text w={"fit-content"} color={"white"}>
                            {answers[index]}
                          </Text>
                        </Box>
                        <Text
                          cursor={"pointer"}
                          textDecoration={"underline"}
                          onClick={() => {
                            console.log(index);
                            setEditQuestionIndex(index);
                          }}
                        >
                          수정
                        </Text>
                      </Stack>
                    )}
                  </Stack>
                </>
              )
          )}
        </Stack>
      </Stack>
      <Flex position={"sticky"} bottom={0} left={0} right={0}>
        <BottomNavigation />
      </Flex>
    </Stack>
  );
}

export default Counseling;
