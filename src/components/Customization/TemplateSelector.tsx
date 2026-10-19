import React from "react";
import { CheckCircle } from "lucide-react";
import { templates } from "./TemplateData";
import Image from "next/image";

type TemplateSelectorProps = {
  designSource: "template" | "upload";
  setDesignSource: (src: "template" | "upload") => void;
  selectedTemplate: string | null;
  setSelectedTemplate: (t: string | null) => void;
  uploadedDesign: string | null;
  setUploadedDesign: (u: string | null) => void;
};

export default function TemplateSelector({
  designSource,
  setDesignSource,
  selectedTemplate,
  setSelectedTemplate,
  uploadedDesign,
  setUploadedDesign,
}: TemplateSelectorProps) {
  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setUploadedDesign(url);
    } else if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setUploadedDesign(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Design Source */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Design Source
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="designSource"
              value="template"
              checked={designSource === "template"}
              onChange={() => setDesignSource("template")}
              className="form-radio h-4 w-4 text-purple-600"
            />
            <span className="ml-2">Browse Templates</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="designSource"
              value="upload"
              checked={designSource === "upload"}
              onChange={() => setDesignSource("upload")}
              className="form-radio h-4 w-4 text-purple-600"
            />
            <span className="ml-2">Upload Your Own Design</span>
          </label>
        </div>
      </div>

      {designSource === "template" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {templates.map((tpl) => {
            const isSelected = selectedTemplate === tpl.previewImage;
            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.previewImage)}
                className={`relative group cursor-pointer rounded-xl overflow-hidden bg-white shadow-sm border transition-all duration-300 ${
                  isSelected
                    ? "border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.3)] ring-1 ring-purple-600 scale-[1.02]"
                    : "border-gray-200 hover:border-purple-400 hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div className="w-full h-28 relative bg-gray-50 border-b border-gray-100">
                  <Image
                    src={tpl.previewImage}
                    alt={tpl.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="p-3 text-center bg-white">
                  <p className={`text-sm font-semibold ${isSelected ? "text-purple-700" : "text-neutral-700 group-hover:text-purple-600"}`}>
                    {tpl.name}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-white rounded-full shadow-sm">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, application/pdf"
            onChange={handleDesignUpload}
            className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {uploadedDesign && (
            <p className="mt-2 text-sm text-neutral-600">Design uploaded.</p>
          )}
        </div>
      )}
    </div>
  );
}
