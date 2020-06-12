import React, { Component } from 'react';
import successIcon from '../../assets/images/success.svg';
import warningIcon from '../../assets/images/warning.svg';
import Notification from '../Notification/Notification';

export default class NotificationSystem extends Component {
	static defaultProps = {
		maxNotificationsCount: 3,
	};

	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
		};
	}

	postNotification = (_notification) => {
		this.setState({
			notifications: [
				...this.state.notifications,
				{
					..._notification,
					id: Math.random(),
				},
			],
		});
	};

	requeueNotification = (id) => {
		const notificationIndex = this.state.notifications.findIndex(
			(notification) => notification.id === id
		);
		if (notificationIndex !== -1) {
			this.state.notifications.splice(notificationIndex, 1);
			this.forceUpdate();
		}
	};

	render() {
		return (
			<>
				{this.state.notifications
					.slice(0, this.props.maxNotificationsCount)
					.map((notification, index) => (
						<Notification
							id={notification.id}
							key={notification.id}
							icon={notification.success ? successIcon : warningIcon}
							index={
								Math.min(
									this.state.notifications.length,
									this.props.maxNotificationsCount
								) -
								index -
								1
							}
							title={notification.title}
							description={notification.description}
							action={notification.action}
							callback={(id, actionClicked) => {
								if (actionClicked) {
									notification.callback && notification.callback();
								} else {
									this.requeueNotification(id);
								}
							}}
						/>
					))}
			</>
		);
	}
}
