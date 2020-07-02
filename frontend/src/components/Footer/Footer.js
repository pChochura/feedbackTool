import React, { Component } from 'react';
import { StyledFooter } from './styles';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import {
	FeedbackDescription,
	StyledLabel,
	StyledInput,
	FeedbackSendButtonWrapper,
	StyledTextArea,
} from '../Modal/styles';
import NotificationSystem from '../NotificationSystem/NotificationSystem';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notificationSystem: null,
			feedbackSent: false,
			feedbackModal: null,
			feedback: '',
			email: '',
		};
	}

	sendFeedback = async () => {
		if (!this.state.feedback || this.state.feedback === '') {
			this.state.notificationSystem.postNotification({
				title: 'Error',
				description: 'You have to enter the feedback field.',
			});

			return;
		}

		this.setState({ feedbackSent: true });

		const result = await fetch(`${process.env.REACT_APP_URL}/api/v1/feedback`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				email: this.state.email || null,
				content: this.state.feedback,
			}),
			headers: { 'Content-Type': 'application/json' },
		});

		this.setState({ feedbackSent: null });

		if (result.status !== 200) {
			this.state.notificationSystem.postNotification({
				title: 'Error',
				description: 'We encountered some problems while sending an email.',
			});

			return;
		}

		this.state.notificationSystem.postNotification({
			title: 'Success',
			description: 'Thank your for your feedback!',
			success: true,
		});

		this.setState({
			feedbackModal: { exit: true },
			email: null,
			feedback: null,
		});
	};

	showFeedbackModal = () => {
		this.setState({
			feedbackModal: {},
		});
	};

	render() {
		return (
			<>
				<StyledFooter>
					<span>
						Have a question?
						<Button
							secondary
							color="#ABABAB"
							small
							onClick={() => this.setState({ feedbackModal: {} })}
						>
							Ask us
						</Button>
					</span>
					<span>
						<em>2020 | </em>FeedbackTool
					</span>
				</StyledFooter>
				{this.state.feedbackModal && (
					<Modal
						title="How can we improve?"
						description="Please describe things you liked and disliked about FeedbackTool."
						onDismissCallback={() => this.setState({ feedbackModal: null })}
						isExiting={(this.state.feedbackModal || {}).exit}
					>
						<FeedbackDescription>
							If you want to hear about improvements you suggested, please give
							us a way to contact you.
						</FeedbackDescription>
						<StyledLabel>
							Your feedback<b>*</b>
						</StyledLabel>
						<StyledTextArea
							minRows={5}
							maxRows={5}
							autoFocus
							onChange={(e) => this.setState({ feedback: e.target.value })}
							value={this.state.feedback}
						/>
						<StyledLabel>Your email</StyledLabel>
						<StyledInput
							type='email'
							onChange={(e) => this.setState({ email: e.target.value })}
							value={this.state.email}
							onKeyPress={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									if (!e.shiftKey && !e.ctrlKey) {
										this.sendFeedback();
									}
								}
							}}
						/>
						<FeedbackSendButtonWrapper>
							<Button
								disabled={this.state.feedbackSent}
								loading={this.state.feedbackSent}
								onClick={() => this.sendFeedback()}
							>
								Send
							</Button>
						</FeedbackSendButtonWrapper>
					</Modal>
				)}
				<NotificationSystem
					ref={(ns) =>
						!this.state.notificationSystem &&
						this.setState({ notificationSystem: ns })
					}
				/>
			</>
		);
	}
}
