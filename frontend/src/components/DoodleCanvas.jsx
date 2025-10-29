import { useRef, useEffect, useState } from "react";
import { X, Download, Trash2, Palette } from "lucide-react";

const DoodleCanvas = ({ isOpen, onClose, onSendDoodle }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(3);
  const [brushColor, setBrushColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", 
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500",
    "#800080", "#FFC0CB", "#A52A2A", "#808080"
  ];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Set canvas size
      canvas.width = 400;
      canvas.height = 300;
      
      // Set initial styles
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      // Clear canvas
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isOpen, brushColor, brushSize]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDoodle = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `doodle-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const sendDoodle = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    onSendDoodle(dataURL);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-xl font-semibold">Doodle</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Container */}
        <div className="p-4">
          <div className="border-2 border-dashed border-base-300 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousedown", {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                });
                canvasRef.current.dispatchEvent(mouseEvent);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousemove", {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                });
                canvasRef.current.dispatchEvent(mouseEvent);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                const mouseEvent = new MouseEvent("mouseup", {});
                canvasRef.current.dispatchEvent(mouseEvent);
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-base-300 space-y-4">
          {/* Brush Size */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Brush Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="range range-primary range-sm flex-1"
            />
            <span className="text-sm w-8">{brushSize}</span>
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Color:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="btn btn-outline btn-sm"
              >
                <Palette className="w-4 h-4 mr-1" />
                Colors
              </button>
              <div
                className="w-8 h-8 rounded border-2 border-base-300"
                style={{ backgroundColor: brushColor }}
              ></div>
            </div>
          </div>

          {/* Color Palette */}
          {showColorPicker && (
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setBrushColor(color)}
                  className={`w-8 h-8 rounded border-2 ${
                    brushColor === color ? "border-primary" : "border-base-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={clearCanvas} className="btn btn-outline btn-sm">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </button>
            <button onClick={downloadDoodle} className="btn btn-outline btn-sm">
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
            <button onClick={sendDoodle} className="btn btn-primary btn-sm flex-1">
              Send Doodle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoodleCanvas;
