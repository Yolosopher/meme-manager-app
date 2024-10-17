import Confirmation from './confirmation/Confirmation';

type LogoutButtonProps = {
  children: React.ReactNode;
  logoutHandler: () => Promise<void>;
};

const LogoutButton = ({ children, logoutHandler }: LogoutButtonProps) => {
  return (
    <Confirmation
      title="Logout Action"
      description="Are you sure you want to log out?"
      triggerContent={children}
      onConfirm={logoutHandler}
    />
  );
};

export default LogoutButton;
