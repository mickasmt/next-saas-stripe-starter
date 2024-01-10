'use client'

import { X } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { isWebUri } from 'valid-url'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const extractBaseUri = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    return url.hostname; // Returns the base domain
  } catch (error) {
    return urlString; // If extraction fails, return the full URL
  }
};

const isValidUrl = (url: string) => {
  return isWebUri(url);
};

const UrlInput = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [urlData, setUrlData] = useState<{ url: string, valid: boolean }[]>([]);

  const processUrls = (urlString: string) => {
    const newUrls = urlString.split(/[\n,]+/).map(url => url.trim());
    const updatedUrlData = newUrls.map(url => ({
      url: url,
      valid: isValidUrl(url)
    }));

    setUrlData(prev => [...prev, ...updatedUrlData]);
    setValue('urls', '');
  };

  const handleKeyDown = (event) => {
    const inputFieldValue = getValues('urls');

    if (event.key === 'Enter') {
      event.preventDefault();
      processUrls(inputFieldValue);
      setValue('urls', '');
    } else if (event.key === ',') {
      event.preventDefault();
      processUrls(inputFieldValue + ',');
      setValue('urls', '');
    } else if (event.key === 'Backspace' && inputFieldValue === '') {
      event.preventDefault();
      removeLastUrl();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    processUrls(pastedText);
  };

  const handleBlur = () => {
    const inputFieldValue = getValues('urls');
    if (inputFieldValue.trim()) {
      processUrls(inputFieldValue);
      setValue('urls', '');
    }
  };

  const removeUrl = (index: number) => {
    setUrlData(current => current.filter((_, i) => i !== index));
  };

  const removeLastUrl = () => {
    if (urlData.length > 0) {
      removeUrl(urlData.length - 1);
    }
  };

  // Derived states
  const displayUrls = useMemo(() => urlData.map(u => ({ url: extractBaseUri(u.url), valid: u.valid })), [urlData]);
  const validUrls = useMemo(() => urlData.filter(u => u.valid).map(u => u.url), [urlData]);
  const invalidUrls = useMemo(() => urlData.filter(u => !u.valid).map(u => u.url), [urlData]);
  const isSubmitDisabled = validUrls.length === 0 || invalidUrls.length > 0;

  const onSubmit = (data) => {
    console.log({data});
  }

  return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div
        tabIndex={-1}
        className="flex flex-wrap border rounded focus-within:outline focus-within:outline-2 focus-within:outline-blue-500">
				{displayUrls.map((item, index) => (
					<div tabIndex={-1} key={index} className={`text-xs flex items-center ml-2 p-2 max-h-6 rounded-full border self-center ${item.valid ? 'bg-blue-100 text-blue-800 border-blue-400' : 'bg-red-100 text-red-800 border-red-400'}`}>
						{item.url}
						<Button
              tabIndex={-1}
              variant="ghost"
              type="button"
              onClick={() => removeUrl(index)}
              size="badge"
              className={`ml-1 rounded-full ontline-none ${item.valid ? 'hover:bg-blue-100 hover:text-blue-800' : 'hover:bg-blue-100 hover:text-red-800'}`}
            >
              <X tabIndex={-1} className='h-3 w-3'/>
            </Button>
					</div>
				))}
				<input
					type="text"
					className="flex-1 form-input mt-1 outline-none p-2"
					{...register("urls")}
					onKeyDown={handleKeyDown}
					onPaste={handlePaste}
          onBlur={handleBlur}
					placeholder={displayUrls.length > 0 ? "" : "Enter URLs"}
				/>
			</div>
			<Button
        type="submit"
        disabled={isSubmitDisabled}
        className={`mt-2 px-4 py-2 rounded text-white ${isSubmitDisabled ? 'bg-gray-500' : 'bg-blue-500'}`}
      >
				{validUrls && validUrls.length > 0 ? `Add ${validUrls.length} Items` : 'Add Items'	}
			</Button>
		</form>
  );
};

export default UrlInput;