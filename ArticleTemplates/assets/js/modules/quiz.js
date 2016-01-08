/*global window,console,define */
define([
    'bean',
    'bonzo',
    'modules/$'
], function (
    bean,
    bonzo,
    $
) {
    'use strict';

    var modules = {
        quizInit: function(quiz) {
            var $quiz = $(quiz);

            if (!$quiz.length) {
                return false;
            }
            
            // Store the answers and remove the answer elements
            var answers = $('.quiz__correct-answers').html().split(',');
            $('.quiz__correct-answers-title, .quiz__correct-answers').remove();

            // Store vars for scoring the quiz
            var numQuestions = answers.length,
                numAnswered = 0,
                score = 0;

            // Append the quiz scores popup
            $quiz.append('<div class="quiz-scores"><div class="quiz-scores__inner"></div></div>');
            $('.quiz-scores__inner').append('<div class="quiz-scores__close"></div>').append('<p class="quiz-scores__score"></p>');
            bean.on(window, 'click.quizclose', $('.quiz-scores__close'), function() {
                $('.quiz-scores').removeClass('open').addClass('minimised');
            });

            // Loop through every question and set up the answers and click events for it's answers
            $('.quiz__question').each(function(question, index) {
                // Wrap question in a div for styling
                var questionWrapper = document.createElement('div'),
                    questionAnswerList = question.querySelectorAll('.question__answers');
                $(questionWrapper).addClass('question__wrapper');
                question.insertBefore(questionWrapper, questionAnswerList[0]);
                
                // Does this question have an image (if tools stripped out empty image tags some of this would be unnecessary)
                var questionImg = question.querySelectorAll(':scope > img');
                if (questionImg.length) {
                    if ($(questionImg).attr('src') !== '') {
                        $(question).addClass('has-image');
                        $(questionImg).addClass('question__img');
                        $(questionWrapper).append(questionImg);
                    } else {
                        $(questionImg).remove();
                    }
                }

                // Does this question have text
                var questionText = question.querySelectorAll('.question__text');
                if (questionText.length) {
                    $(questionWrapper).append(questionText);
                }

                // This question's correct answer & response text
                var $correctAnswer,
                    $correctAnswerWrapper,
                    correctAnswerArray = answers[index].split(':')[1].split('-'),
                    correctAnswerCode = correctAnswerArray[0].trim().toUpperCase(),
                    correctAnswerExplanation = correctAnswerArray[1];

                // All the answers for this question
                var questionAnswers = this.querySelectorAll('.question__answer');

                // Loop through each answer and set up it's styling
                $(questionAnswers).each(function(answer, index) {
                    // Wrap answer in a div for styling
                    var answerWrapper = document.createElement('div');
                    $(answerWrapper).addClass('answer__wrapper');
                    $(answer).append(answerWrapper);
                    
                    // Add an answer message div to wrap text answer, correct/wrong message and explanation response
                    var answerMessage = document.createElement('div');
                    $(answerMessage).addClass('answer__message');
                    $(answerWrapper).append(answerMessage);

                    // Add a marker icon span 
                    var answerMarker = document.createElement('div');
                    $(answerMarker).addClass('answer__marker');
                    $(answerWrapper).append(answerMarker);
                    
                    // Does this answer have an image (if tools stripped out empty image tags some of this would be unnecessary)
                    var answerImg = answer.querySelectorAll(':scope > img');
                    if (answerImg.length) {
                        if ($(answerImg).attr('src') !== '') {
                            $(answer).addClass('has-image');
                            $(answerImg).addClass('answer__img');
                            $(answerWrapper).append(answerImg);
                        } else {
                            $(answerImg).remove();
                            answerImg = '';
                        }
                    }

                    // Does this answer have text
                    var answerText = answer.querySelectorAll('.answer__text');
                    if (answerText.length) {
                        $(answerMessage).append(answerText);
                    }
                    
                    // Find this answers alpha key
                    var thisAnswer = String.fromCharCode(65 + index);
                    
                    // Is this answer the correct answer
                    if (thisAnswer == correctAnswerCode) {
                        $correctAnswer = $(answer);
                        $correctAnswerWrapper = $(answerMessage);
                    }

                    // Set up an onclick to handle when a user selects this answer
                    bean.on(answer, 'click', function() {
                        if ($(question).hasClass('answered')) {
                            // Question has already been answered 
                            return false;
                        } else {
                            // Mark question as answered and keep track of total q's answered
                            $(question).addClass('answered');
                            numAnswered ++;
                        }

                        // Flag the correct answer & add response if one is available
                        $correctAnswer.addClass('correct-answer');
                        if (correctAnswerExplanation) {
                            $correctAnswerWrapper.append('<p class="answer__explanation">' + correctAnswerExplanation.trim() + '</p>');
                        }

                        // Check if this answer is correct & mark question as correct or wrong
                        if (thisAnswer == correctAnswerCode) {
                            $(question).addClass('is-correct');
                            score ++;
                        } else {
                            $(question).addClass('is-wrong');
                            $(this).addClass('wrong-answer');
                        }

                        // When we have an image answer we need to move the positioning of the explanation and marker 
                        if (answerImg.length) {
                            var markedAnswers = question.querySelectorAll('.correct-answer, .wrong-answer');

                            $(markedAnswers).each(function(markedAnswer, index) {
                                var thisMessage = markedAnswer.querySelectorAll('.answer__message')[0],
                                    thisHeight = thisMessage.offsetHeight,
                                    thisMarker = markedAnswer.querySelectorAll('.answer__marker')[0];

                                    // position explanation to the bottom of wrapper
                                    thisMessage.style.top = 'calc(100% - ' + thisHeight + 'px)';
                                    thisMarker.style.top = 'calc(100% - ' + (thisHeight - 7) + 'px)';
                            });
                        }

                        // If all questions have been answered display the score
                        if (numQuestions == numAnswered) {
                            $('.quiz-scores__score').html('<span class="quiz-scores__correct">' + score +'</span> / <span class="quiz-scores__questions">' + numQuestions + '</span>');
                            $('.quiz-scores').addClass('open');
                            $('.quiz__navigation').hide();
                        }
                    });
                });
            });

            // store all questions top offset for later (this was for the jump to next question feature)
            // $('.quiz__question').each(function(question, index){
            //    var offset = $(question).offset().top;
            //    $(question).attr({
            //         'data-offset': offset,
            //         'id': 'questionNum' + index
            //     });
            // });
        }
    },

    ready = function () {
        if (!this.initialised) {
            this.initialised = true;
            var quiz = $('.quiz');
            if (quiz.length) {
                // We have a quiz atom on the page so setup the quizzes
                modules.quizInit(quiz[0]);
            }
        }
    };

    return {
        init: ready
    };

});