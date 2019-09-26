import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import * as Scroll from 'react-scroll';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';
import EmailIcon from 'material-ui/svg-icons/communication/email';

export default class LandingPage extends Component {
	state = {
		name: '',
		email: '',
		introduction: '',
		portfolioLink: '',
		errorMessage: '',
		isValid: false,
		isLoading: false,
		isSendingFormSuccess: false
	};

	handleValidateInput() {
		let { name, email, introduction } = this.state;
		let message = {};
		message['email'] = email
			? /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email) ? '' : '請輸入一個有效的電子信箱'
			: '請輸入email，我們會寄送後續活動訊息到此email';
		message['name'] = name ? '' : '請輸入姓名，讓我們知道怎麼稱呼你 :)';
		message['introduction'] = introduction ? '' : '由於本活動為審核制，此欄位為必填，謝謝您';
		this.setState({ errorMessage: message });
		if (message.email || message.name || message.introduction) return;
		this.handleCheckEmailisValid(message);
	}

	handleCheckEmailisValid(message) {
		this.setState({ isLoading: true });
		let { email, name, introduction, portfolioLink } = this.state;
		const uri = `https://wizardamigos-server.herokuapp.com/api/checkmail/${email}`;
		axios.get(uri).then((response) => {
			if (response.data.message == 'email 已被使用') {
				this.setState({ errorMessage: { email: 'email已被使用' } });
				this.setState({ isLoading: false });
			} else if (response.data.message == 'email 可使用') {
				axios
					.post('https://wizardamigos-server.herokuapp.com/api/insert', {
						email: email,
						name: name,
						interest: '',
						interests: '',
						skills: '',
						backgroundIntro: introduction,
						portfolioLink: portfolioLink
					})
					.then((response) => {
						this.setState({ isLoading: false });
						this.setState({ isSendingFormSuccess: true });
					})
					.catch((error) => console.log(error));
			}
		});
	}

	renderForm() {
		let { errorMessage } = this.state;
		const styles = {
			hintStyle: { color: 'gray' },
			floatingLabelStyle: { color: '#e488ef' },
			floatingLabelFocusStyle: { color: '#e488ef' },
			underlineStyle: { color: '#fff' },
			underlineFocusStyle: { borderColor: '#e488ef' },
			inputStyle: { color: '#fff' },
			textareaStyle: { color: '#fff' },
			style: { marginTop: '10px' }
		};
		return (
			<FormWrapper>
				<TextField
					hintText="Please enter your name"
					floatingLabelText="Name"
					fullWidth
					value={this.state.name}
					onChange={({ target }) => {
						this.setState({ name: target.value });
					}}
					{...styles}
					require
					errorText={errorMessage.name && errorMessage.name}
				/>
				<TextField
					hintText="Please enter your email"
					floatingLabelText="Email"
					fullWidth
					value={this.state.email}
					onChange={({ target }) => {
						this.setState({ email: target.value });
					}}
					{...styles}
					errorText={errorMessage.email && errorMessage.email}
				/>
				<TextField
					hintText="Please enter your Github/Portfolio link, or uploaded resume file link"
					floatingLabelText="Portfolio Links"
					fullWidth
					value={this.state.portfolioLink}
					onChange={({ target }) => {
						this.setState({ portfolioLink: target.value });
					}}
					{...styles}
				/>
				<TextField
					hintText="這個欄位是為了讓從德國來的Alex與Nina多認識一些參加者的背景。可以盡可能地介紹您自己，附上履歷表的連結，或任何形式，都很歡迎。:) 並盡量以「英文」填寫。"
					floatingLabelText="Self-Introduction"
					fullWidth
					value={this.state.introduction}
					onChange={({ target }) => {
						this.setState({ introduction: target.value });
					}}
					multiLine={true}
					rows={5}
					{...styles}
					errorText={errorMessage.introduction && errorMessage.introduction}
				/>
				<ButtonBlack
					onClick={() => {
						this.handleValidateInput();
					}}
					submit
				>
					Submit
				</ButtonBlack>
			</FormWrapper>
		);
	}

	render() {
		let { isLoading, isSendingFormSuccess, email } = this.state;
		let content = {
			whoWeAre: {
				eng:
					'Wizard Amigos was founded in Berlin but is now a global, non-profit community.Our aim is to provide tools and community to everyone who wants to better understand technology and work on their ideas.Learn prototyping, how to use programming in science, how to build mobile and desktop apps, and what possibilities can technology bring for your future.'
				// chinese:
				// 	// 'Wizard Amigos 來自於德國柏林，目前是一個全球性的非盈利社群。我們的目標是為了給予每位想要更加了解技術及實現想法，想要遠端工作、成為自雇者的人們工具及社群。學習如何建立網頁，行動裝置和桌面應用程式，以及為您的未來帶來了什麼樣的可能性。'
			},
			topics: {
				chinese: [ '如何成為自雇者（商業模式圖，營銷/銷售基礎知識，財務/會計，如何創立公司/法律', '遠端工作（籌辦本地公司/協會）', '區塊鏈服務之概論及應用' ],
				eng: [
					'Self Employment (business model canvas, basics of marketing/sales, finances/accounting, how to open a company/legal) ',
					'Remote Gigs/Jobs (forming a local agency/cooperative (as an app)',
					'JavaScript (how to build web, desktop and mobile apps)',
					'foundations of blockchain and crypto.',
					'learn about "secure scuttlebutt" and/or the "dat project”(Bit Torrent 2.0 P2P systems)'
				]
			}
		};
		let style = {
			link: {
				color: '#CCCCCC',
				fontSize: '19px',
				textDecoration: 'none',
				alignItems: 'center',
				margin: '26px 0',
				display: 'flex'
			},
			emailIcon: {
				width: '50px',
				height: '50px',
				color: '#fff',
				marginRight: '10px'
			},
			facebookIcon: { marginRight: '10px' }
		};

		return (
			<MuiThemeProvider>
				<div>
					<Scene1>
						<Container>
							<Title>Wizard Amigos CodeCamp 2019</Title>
							<Wrapper>
								<ButtonWrapper>
									<Link to="test2" spy={true} smooth={true} offset={50} duration={1000}>
										<ButtonWhite>LEARN MORE</ButtonWhite>
									</Link>
									<Link to="test1" spy={true} smooth={true} offset={50} duration={1500}>
										<ButtonBlack>SIGN UP NOW!</ButtonBlack>
									</Link>
								</ButtonWrapper>
							</Wrapper>
						</Container>
					</Scene1>
					<Scene2 name="test2">
						<Container>
							<SubTitle>Who we are</SubTitle>
							<Wrapper>
								<ListWrapper>
									{/* {content.whoWeAre.chinese} */}
									{content.whoWeAre.eng}
									{/* <ListWrapperInner>{content.whoWeAre.eng}</ListWrapperInner> */}
								</ListWrapper>
							</Wrapper>
						</Container>
					</Scene2>
					<Scene3>
						<Wrapper>
							<TopicBackground>
								<SubTitle>What - Topics</SubTitle>
								{/* {content.topics.chinese.map((list, index) => (
									<List key={`topics_${index}`}>{list}</List>
                ))} */}
								{content.topics.eng.map((list, index) => (
									<List eng key={`topics_${index}`}>
										{list}
									</List>
								))}
								{/* <ListWrapperInner>
									{content.topics.eng.map((list, index) => (
										<List eng key={`topics_${index}`}>
											{list}
										</List>
									))}
								</ListWrapperInner> */}
							</TopicBackground>
						</Wrapper>
					</Scene3>
					<CyberNomadSpirit>
						<Wrapper>
							<SubTitle big>Learn Cyber Nomad spirit with Alex and Nina!</SubTitle>
						</Wrapper>
					</CyberNomadSpirit>
					<Scene5>
						<Wrapper>
							<PhotoContainer>
								<PhotoWrapper>
									<Lecturer>
										<Photo big src="/static/alex2.jpg" />
										<TitleOftheEvent>Lecturer</TitleOftheEvent>
										<Name>Alex Praetorius</Name>
										<Introduction>
											JavaScript cyber nomad debugging the global economy with projects like
											@codingamigos, @refugeeswork and @wizardamigos (the workshop is part of
											@wizardamigos)
										</Introduction>
									</Lecturer>
									<Lecturer>
										<Photo big src="/static/nina2.jpg" />
										<TitleOftheEvent>Lecturer</TitleOftheEvent>
										<Name>Nina Breznik</Name>
										<Introduction>
											Hacktivist http://www.refugeeswork.com/ Community builder
											http://codingamigos.com/ & @wizardamigos Solopreneur
											http://fairydust.agency/
										</Introduction>
									</Lecturer>
								</PhotoWrapper>
								<PhotoWrapper>
									<CoOrganizer>
										<Photo src="/static/tzuyuan.jpg" />
										<TitleOftheEvent>Co-organizers</TitleOftheEvent>
										<Name small>Tzuyuan Liu</Name>
										<Description>React Native Mobile Developer/Web Frontend developer</Description>
									</CoOrganizer>
									{/* <CoOrganizer>
										<Photo src="/static/jerry.jpg" />
										<TitleOftheEvent>Co-organizers</TitleOftheEvent>
										<Name small>Jerry Lin</Name>
										<Description>Blockchain ecosystem engineer</Description>
									</CoOrganizer> */}
									<CoOrganizer>
										<Photo src="/static/kang.jpg" />
										<TitleOftheEvent>Co-organizers</TitleOftheEvent>
										<Name small>Oo Kang Zheng</Name>
										<Description>Interactive Engineer</Description>
									</CoOrganizer>
								</PhotoWrapper>
							</PhotoContainer>
						</Wrapper>
					</Scene5>
					<Wrapper>
						<DateScene>
							<SubTitle>When & Where</SubTitle>
							<DateSceneContentWrapper>
								Coworking Space Punspace Nimman (Please notice the location might change) Chiang Mai
								Thailand (Oct 20 - Nov 20)
								<Map2 src="/static/map2019.png" />
							</DateSceneContentWrapper>
						</DateScene>
					</Wrapper>
					<Scene2>
						<Wrapper>
							<SubTitle>What you will learn</SubTitle>
							<WhatYouWillLearn>
								1. The basic application of Javascript (the main language of this event) <br />
								2. Introduction and application of blockchain services (eg DAT Project 2.0)<br />
								3. OSS (Open Source Software)<br />
								4. How to become a self-employed person (business model diagram, marketing/sales basics,
								finance/accounting, how to create a company/law)<br />
								5. Initial work (organizing local companies/associations)<br />
								Combining the above factors, after the course, we will take you to know the remote
								workers' case, company management, community participation, business model and other
								knowledge, and then achieve a win-win situation (self-interest, benefit community), what
								will be learned Knowledge and application experience is fed back to the open source
								community to enable the open source community to grow.
							</WhatYouWillLearn>
						</Wrapper>
					</Scene2>
					<Scene6 name="test1">
						<Wrapper>
							<SubTitle>Sign Up</SubTitle>
							{/* {isSendingFormSuccess ? (
								<SuccessSentWrapper>
									<SubTitle style={{ color: '#e488ef' }}>太棒了！</SubTitle>
									<SuccessSentInnerWrapper>
										報名表單已成功送出，請確認您的email {email}
										我們將會以此mail通知您後續課程訊息 ：）
										<br />
										<br />
										期待在課程上見到您！
									</SuccessSentInnerWrapper>
								</SuccessSentWrapper>
							) : isLoading ? (
								<FormLoadingWrapper>
									<CircularProgress color="#e488ef" size={80} thickness={5} />
								</FormLoadingWrapper>
							) : (
								this.renderForm()
              )} */}
							<ButtonBlackSignUp>
								<a
									style={{ textDecoration: 'none', display: 'block' }}
									target="_blank"
									href="https://ninabreznik.typeform.com/to/Q8i4zN?fbclid=IwAR06OeKb-CF6mSrjY1jah-ytXQca3YF71_eBKGNXYkbKC9KZWmeEnRCFX6E"
								>
									Join us now!
								</a>
							</ButtonBlackSignUp>
						</Wrapper>
					</Scene6>
					<Footer>
						<Wrapper>
							<Contact>
								<a style={style.link} href="mailto:wizardamigos.codecamp@gmail.com">
									<EmailIcon style={style.emailIcon} />wizardamigos.codecamp@gmail.com
								</a>
							</Contact>
							<Contact>
								<a
									style={style.link}
									target="_blank"
									href="https://www.facebook.com/groups/369246343421803/"
								>
									<FaceBookIcon style={style.facebookIcon} />WizardAmigos Codecamp on Facebook
								</a>
							</Contact>
							<FooterIntro>
								{' '}
								WizardAmigos is a FREE open source, open collaborative, and free DIY programming school
								from Berlin, now starting in Taipei. People of all skill levels and backgrounds are
								welcome to join and learn together.
							</FooterIntro>
						</Wrapper>
					</Footer>
				</div>
			</MuiThemeProvider>
		);
	}
}

const Black = '#030707';
const Contact = styled.div`
	display: flex;
	align-items: center;
`;
const FooterIntro = styled.div`margin-top: 30px;`;
const Container = styled.div`
	width: 100%;
	color: #fff;
	display: flex;
	flex-direction: column;
`;
const Wrapper = styled.div`
	width: 80%;
	margin: auto;
	padding: 40px 0;
`;
const Scene1 = styled.div`
	height: 800px;
	background-image: linear-gradient(#00000021, #0000009c), url(/static/chiang_mai.jpg);
	background-size: cover;
	background-position: center;
`;
const Title = styled.div`
	display: flex;
	font-size: 60px;
	justify-content: center;
	margin: 395px auto 25px;
	background-color: #181a18b8;
	@media (max-width: 768px) {
		font-size: 6vw;
	}
`;
const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
`;
const Button = styled.div`
	font-size: 30px;
	padding: 10px;
	cursor: pointer;
	text-align: center;
`;
const ButtonWhite = styled(Button)`
  border: solid 1px #fff;
  background: #fff;
  color: ${Black};
  `;
const ButtonBlack = styled(Button)`
  border: solid 1px #fff;
  font-size: 30px;
  padding: 10px;
  color: #fff;
  background: gray;
  &:hover {
    color: ${Black};
    background: #fff;
  }
  ${(props) =>
		props.submit &&
		css`
			width: 100%;
			margin: 50px auto;
		`}
  `;
const ButtonBlackSignUp = styled(Button)`
  a {color: #fff}
  margin: 70px 0;
  border: solid 1px #fff;
  font-size: 40px;
  padding: 10px;
  color: #fff;
  &:hover {
    a {color: ${Black};};
    background: #fff;
  }
  ${(props) =>
		props.submit &&
		css`
			width: 100%;
			margin: 50px auto;
		`}
  `;
const Scene2 = styled.div`
	background: #3b323e;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 40px 0;
`;
const SubTitle = styled.div`
	font-size: ${(props) => (props.big ? '60px' : '40px')};
	display: flex;
	justify-content: center;
	margin: 10px 0 10px 0;
`;
const ListWrapper = styled.div`
	justify-content: center;
	margin: 0 auto;
	font-size: 25px;
	line-height: 1.5;
`;
const List = styled.div`
	font-size: ${(props) => (props.eng ? '18px' : '25px')};
	line-height: 1.5;
`;
const Scene3 = styled.div`
	filter: grayscale(80%);
	background-image: url('/static/scene3.jpg');
	background-size: cover;
	width: 100%;
	display: flex;
	align-items: center;
	transition: all .3s;
	min-height: 600px;
	text-align: center;
	&:hover {
		filter: grayscale(0%);
	}
`;
const TopicBackground = styled.div`
	background: rgba(0, 0, 0, .7);
	margin: auto;
	padding: 45px;
	width: 80%;
`;
const CyberNomadSpirit = styled(Scene2)`
  height: 500px;
  `;
const Scene5 = styled.div`background: #171616;`;
const DateScene = styled.div`
	background: #fff;
	color: #4a4a4a;
`;
const DateSceneContentWrapper = styled.div`
	padding: 20px;
	color: #4a4a4a;
	text-align: left;
	font-size: 20px;
	line-height: 2;
	display: flex;
	align-items: center;
	justify-content: space-around;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;
const PhotoContainer = styled.div`
	margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
`;
const PhotoWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;
const Photo = styled.img`
	align-self: center;
	margin: 25px;
	filter: grayscale(80%);
	border-radius: 50%;
	width: ${(props) => (props.big ? '250px' : '180px')};
	height: ${(props) => (props.big ? '250px' : '180px')};
	transition: all .3s;
	filter: grayscale(80%);
	&:hover {
		filter: grayscale(0%);
	}
`;
const Lecturer = styled.div`
	display: flex;
	flex-direction: column;
`;
const CoOrganizer = styled.div`
	display: flex;
	flex-direction: column;
`;
const TitleOftheEvent = styled.div`
	display: flex;
	align-self: center;
	font-size: 20px;
`;
const Name = styled.div`
	font-size: ${(props) => (props.small ? '20px' : '40px')};
	display: flex;
	align-self: center;
	line-height: 2;
`;
const Scene6 = styled.div`background: #070808;`;
const FormWrapper = styled.div`
	width: 60%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: auto;
	padding-top: 10vh;
	& > input {
		margin: 20px 20px 65px;
	}
	& > textarea {
		margin: 20px;
		resize: none;
		height: 150px;
	}
	@media (max-width: 1024px) {
		width: 100%;
	}
`;
const Introduction = styled.div`
	width: 100%;
	font-size: 15px;
	line-height: 1.5;
	text-align: center;
`;
const Footer = styled.div`
	width: 100%;
	font-size: 15px;
	display: flex;
	align-items: center;
	background: #111111;
`;
const Description = styled.div`
	font-size: 14px;
	line-height: 1.5;
	text-align: center;
`;
const FormLoadingWrapper = styled.div`
	height: 415px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const ListWrapperInner = styled.div`
	margin-top: 20px;
	font-size: 18px;
`;
const WhatYouWillLearn = styled.div`
	font-size: 20px;
	line-height: 2;
	text-align: left;
	margin: auto;
	width: 80%;
`;
const Map2 = styled.img`
	width: 40vw;
	@media (max-width: 768px) {
		width: 100%;
	}
`;
const SuccessSentWrapper = styled.div`
	height: 415px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	@media (max-width: 768px) {
		height: auto;
	}
`;
const SuccessSentInnerWrapper = styled.div`
	font-size: 25px;
	line-height: 2;
	width: 50%;
`;
const FaceBookIcon = styled.div`
	display: inline-block;
	width: 50px;
	height: 50px;
	background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IgogICAgIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIKICAgICB2aWV3Qm94PSIwIDAgNTAgNTAiCiAgICAgc3R5bGU9IjtmaWxsOiNjY2NjY2M7IgogICAgIGNsYXNzPSJpY29uIGljb25zOC1mYWNlYm9vay1maWxsZWQiPiAgICA8cGF0aCBkPSJNNDEsNEg5QzYuMjQsNCw0LDYuMjQsNCw5djMyYzAsMi43NiwyLjI0LDUsNSw1aDMyYzIuNzYsMCw1LTIuMjQsNS01VjlDNDYsNi4yNCw0My43Niw0LDQxLDR6IE0zNywxOWgtMmMtMi4xNCwwLTMsMC41LTMsMiB2M2g1bC0xLDVoLTR2MTVoLTVWMjloLTR2LTVoNHYtM2MwLTQsMi03LDYtN2MyLjksMCw0LDEsNCwxVjE5eiI+PC9wYXRoPjwvc3ZnPg==')
		50% 50% no-repeat;
	background-size: 100%;
`;
