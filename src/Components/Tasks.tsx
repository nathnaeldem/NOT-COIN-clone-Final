import styled from 'styled-components';
import { FcOk } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";
interface CardProps {
  icon: React.ReactNode;
  title: string;
 
  reward: string;
  isDone: boolean;
  
 
}

const CardWrapper = styled.div`
  background-color: ;
  border-radius: 12px;
  box-shadow: 0 2px 4px #ab5463;
  padding: 12px;
  width: 93%;
  margin-top: 20px;
  margin-left: 15px;
  
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0px;
  text-align:center;
`;


const Title = styled.h3`
  font-size: 28px;
  margin-bottom: 8px;
  color: white;
  font-weight: bold;
`;


const Reward = styled.p`
  font-size: 14px;
  color: #40f0f0; /* Blue color for the reward */
  margin-top: 8px;
  text-align:center
`;

const Card: React.FC<CardProps> = ({ isDone,icon, title, reward,}) => {

 

    return (
 
      <CardWrapper>
      <IconWrapper>
        {icon}
        <Title>{title}</Title>
      </IconWrapper>
      <Reward>{reward}</Reward>
      {isDone ? <FcOk /> : <div style={{display:'flex'}}><GoDotFill style={{ color: '#11f20d',marginTop:'4px' }} /> <p style={{color:'#feefba'}}>new</p></div>}
    </CardWrapper>
      
    
  );
};

export default Card;
