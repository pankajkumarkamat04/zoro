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
        // Make the circle responsive while capping at original size
        width: 'min(469px, 80vw)',
        height: 'min(457px, 80vw)',
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
