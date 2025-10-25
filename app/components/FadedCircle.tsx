interface FadedCircleProps {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
}

export default function FadedCircle({ top = '812px', left = '-11px', bottom, right }: FadedCircleProps) {
  return (
    <div 
      className="absolute"
      style={{
        width: '469px',
        height: '457px',
        ...(bottom ? { bottom, right } : { top, left }),
        opacity: 0.8,
        background: 'radial-gradient(circle, #ffffff29 30%, #ffffff00 70%, #00000000 100%)',
        backdropFilter: 'blur(100px)',
        borderRadius: '50%',
        transform: bottom ? 'translateY(50%)' : 'translateY(-50%)',
        zIndex: 0
      }}
    />
  );
}
