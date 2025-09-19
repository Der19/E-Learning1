import { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
  color: string;
  opacity: number;
  life: number;
}

const SimpleCursor = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<number>();
  const lastMouseTime = useRef<number>(0);

  const colors = ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff', '#ff4040', '#ffff00', '#00ffff', '#ff00ff', '#00ff00'];

  const createPoint = useCallback((x: number, y: number): Point => {
    return {
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      life: 1
    };
  }, [colors]);

  const updatePoints = useCallback(() => {
    setPoints(prev => 
      prev
        .map(point => ({
          ...point,
          opacity: point.opacity * 0.80, // Fade plus rapide sur mobile
          life: point.life + 1
        }))
        .filter(point => point.opacity > 0.15 && point.life < 20) // Durée plus courte
    );
  }, []);

  const animate = useCallback(() => {
    updatePoints();
    animationRef.current = requestAnimationFrame(animate);
  }, [updatePoints]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    setMousePos({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
    
    // Créer des points plus fréquemment
    if (now - lastMouseTime.current > 20) { // Plus fréquent
      lastMouseTime.current = now;
      const newPoint = createPoint(e.clientX, e.clientY);
      setPoints(prev => [newPoint, ...prev].slice(-8)); // Max 8 points
    }
  }, [createPoint]);

  const handleScroll = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      const now = Date.now();
      setMousePos({ x: touch.clientX, y: touch.clientY });
      setIsVisible(true);
      
      // Créer des points moins fréquemment sur mobile
      if (now - lastMouseTime.current > 100) { // Beaucoup moins fréquent
        lastMouseTime.current = now;
        const newPoint = createPoint(touch.clientX, touch.clientY);
        setPoints(prev => [newPoint, ...prev].slice(-5)); // Moins de points sur mobile
      }
    }
  }, [createPoint]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setMousePos({ x: touch.clientX, y: touch.clientY });
      setIsVisible(true);
      
      // Explosion plus simple sur mobile
      for (let i = 0; i < 3; i++) { // Moins de points
        const angle = (i / 3) * Math.PI * 2;
        const distance = 20; // Distance réduite
        const x = touch.clientX + Math.cos(angle) * distance;
        const y = touch.clientY + Math.sin(angle) * distance;
        const newPoint = createPoint(x, y);
        setPoints(prev => [newPoint, ...prev].slice(-5)); // Moins de points max
      }
    }
  }, [createPoint]);

  const handleClick = useCallback(() => {
    // Explosion plus visible au clic
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const distance = 25;
      const x = mousePos.x + Math.cos(angle) * distance;
      const y = mousePos.y + Math.sin(angle) * distance;
      const newPoint = createPoint(x, y);
      setPoints(prev => [newPoint, ...prev].slice(-8));
    }
  }, [createPoint, mousePos.x, mousePos.y]);

  useEffect(() => {
    // Activer sur mobile aussi
    // const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // if (isMobile) return;

    // Écouter les événements
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', () => setIsVisible(true), { passive: true });
    document.addEventListener('mouseleave', () => setIsVisible(false), { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Événements tactiles pour mobile
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    // Démarrer l'animation
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', () => setIsVisible(true));
      document.removeEventListener('mouseleave', () => setIsVisible(false));
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchstart', handleTouchStart);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleMouseMove, handleClick, handleScroll, animate]);

  return (
    <>
      {points.map((point, index) => (
        <div
          key={index}
          className="simple-point"
          style={{
            position: 'fixed',
            left: point.x - 4,
            top: point.y - 4,
            width: 8,
            height: 8,
            backgroundColor: point.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: point.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 15px ${point.color}90, 0 0 30px ${point.color}60, 0 0 45px ${point.color}30`,
            border: `1px solid ${point.color}40`,
          }}
        />
      ))}
    </>
  );
};

export default SimpleCursor;
