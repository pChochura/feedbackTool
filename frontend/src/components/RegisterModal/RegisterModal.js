import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import { StyledLabel, StyledInput } from '../Modal/styles';
import { ButtonWrapper, StyledParagraph, PlanButton, RowWrapper, StyledPlanText, StyledPlanImg } from './styles';
import NotificationSystem from '../NotificationSystem/NotificationSystem';
import Stepper from '../Stepper/Stepper';
import reccurrenceOnImg from '../../assets/images/reccurrence_on.svg';
import reccurrenceOffImg from '../../assets/images/reccurrence_off.svg';

const RegisterModal = ({ input, callback }) => {
    const [data, setData] = useState({ email: '', password: '', repeatPassword: '', renewalType: 0 });
    const [notificationSystem, setNotificationSystem] = useState();
    const [currentStep, setCurrentStep] = useState(0);
    const [errorInput, setErrorInput] = useState({});

    const info = {
        description: [
            'Creating an account involves purchasing a premium plan',
            'Choose a way of renewing your premium plan',
            'Review entered data to avoid mistakes',
        ],
        primaryButton: [
            {
                content: 'Continue',
                action: () => validateInput() && nextStep(),
            },
            {
                content: 'Continue',
                action: () => nextStep(),
            },
            {
                content: 'Link Paypal',
                action: () => {

                },
            },
        ],
        secondaryButton: [
            {
                content: 'Or <b>login</b> into your account',
                action: () => {
                    callback && callback({ login: true, email: data.email, password: data.password });
                },
            },
            {
                content: 'Or <b>go back</b>',
                action: () => prevStep(),
            },
            {
                content: 'Or <b>go back</b>',
                action: () => prevStep(),
            },
        ],
        steps: [
            'Registration',
            'Customisation',
            'Finalisation'
        ],
        content: [
            <>
                <StyledLabel>
                    Your email
                </StyledLabel>
                <StyledInput
                    autoFocus
                    type='email'
                    name='email'
                    error={errorInput.email}
                    onFocus={() => setErrorInput(e => ({ ...e, email: false }))}
                    onChange={(e) => handleInput(e)}
                    value={data.email} />
                <StyledLabel>
                    Your password
                </StyledLabel>
                <StyledInput
                    type='password'
                    name='password'
                    error={errorInput.password}
                    onFocus={() => setErrorInput(e => ({ ...e, password: false }))}
                    onChange={(e) => handleInput(e)}
                    value={data.password} />
                <StyledLabel>
                    Repeat your password
                </StyledLabel>
                <StyledInput
                    type='password'
                    name='repeatPassword'
                    error={errorInput.repeatPassword}
                    onFocus={() => setErrorInput(e => ({ ...e, repeatPassword: false }))}
                    onChange={(e) => handleInput(e)}
                    value={data.repeatPassword} />
            </>,
            <>
                <RowWrapper>
                    <PlanButton active={data.renewalType === 0} onClick={() => setData(d => ({ ...d, renewalType: 0 }))}>
                        <StyledPlanImg src={reccurrenceOnImg} active={data.renewalType === 0} />
                        <StyledPlanText active={data.renewalType === 0}>Automatically renew premium</StyledPlanText>
                    </PlanButton>
                    <PlanButton active={data.renewalType === 1} onClick={() => setData(d => ({ ...d, renewalType: 1 }))}>
                        <StyledPlanImg src={reccurrenceOffImg} active={data.renewalType === 1} />
                        <StyledPlanText active={data.renewalType === 1}>Manually renew premium</StyledPlanText>
                    </PlanButton>
                </RowWrapper>
                {data.renewalType === 0 ?
                    <StyledParagraph>
                        Your premium plan will be renewed <br />automatically after every 10 premium sesions.
                    </StyledParagraph>
                    :
                    <StyledParagraph>
                        Your premium plan will be renewed <br />only manually. You will be notified accordingly.
                    </StyledParagraph>
                }
            </>,
            <RowWrapper>
                {data.renewalType === 0 ?
                    <StyledParagraph>
                        You (<em>anonymous@ft.tech</em>) have selected <em>automatic</em> renewal method, which involves withdrawal from your <em>Paypal</em> account in the amount of <em>9.99</em>PLN after every 10 premium sessions.
                        <br /><br />
                        You can always <em>change the renewal model</em> in your account page.
                        <br /><br />
                        Also you can <em>delete your account</em> completely to avoid future payments.
                    </StyledParagraph>
                    :
                    <StyledParagraph>
                        You (<em>anonymous@ft.tech</em>) have selected <em>manual</em> renewal method, which involves blocking your premium account after 10 premium sessions until we receive payment in the amount of <em>9.99</em>PLN.
                        <br /><br />
                        You can always <em>change the renewal model</em> in your account page.
                        <br /><br />
                        Also you can <em>delete your account</em> completely to avoid future payments.
                    </StyledParagraph>
                }
            </RowWrapper>
        ]
    };

    const prevStep = () => {
        setCurrentStep(s => s - 1);
    };

    const nextStep = () => {
        setCurrentStep(s => s + 1);
    };

    const validateInput = () => {
        if (!data.email || !data.password || !data.repeatPassword) {
            notificationSystem.postNotification({
                title: 'Error',
                description: 'Every field has to be filled in',
            });
            setErrorInput({
                email: !data.email,
                password: !data.password,
                repeatPassword: !data.repeatPassword,
            });

            return false;
        }

        if (/[\w-]+@[\w-]+\.[\w-]+/.exec(data.email) === null) {
            notificationSystem.postNotification({
                title: 'Error',
                description: 'Email has to be valid',
            });
            setErrorInput({
                email: true,
            });

            return false;
        }

        if (data.password !== data.repeatPassword) {
            notificationSystem.postNotification({
                title: 'Error',
                description: 'Passwords have to match',
            });
            setErrorInput({
                repeatPassword: true,
            });

            return false;
        }

        return true;
    };

    const handleInput = (event) => {
        setData(data => ({
            ...data,
            [event.target.name]: event.target.value,
        }));
    };

    useEffect(() => {
        setData(d => ({
            ...d,
            email: input.email,
            password: input.password,
        }));
    }, [input]);

    return (
        <>
            <Modal
                title="Create a new account"
                description={info.description[currentStep]}
                onDismissCallback={() => callback && callback({})}
                isExiting={false} >
                <Stepper steps={info.steps} currentStep={currentStep} />
                {info.content[currentStep]}
                <ButtonWrapper>
                    <Button onClick={() => info.primaryButton[currentStep].action()}>{info.primaryButton[currentStep].content}</Button>
                </ButtonWrapper>
                <StyledParagraph
                    dangerouslySetInnerHTML={{ __html: info.secondaryButton[currentStep].content }}
                    onClick={() => info.secondaryButton[currentStep].action()} />
            </Modal>
            <NotificationSystem ref={(ns) => setNotificationSystem(ns)} />
        </>
    );
};

export default RegisterModal;
