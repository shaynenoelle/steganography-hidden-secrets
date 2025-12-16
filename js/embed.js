// Embed watermark into image
async function embedWatermark() {
  const watermarkText = document.getElementById("watermarkText").value.trim();
  const password = document.getElementById("watermarkPassword").value;

  // Validation
  if (!originalImageData) {
    showNotification("Please upload an image first!", "error");
    return;
  }

  if (!watermarkText) {
    showNotification("Please enter watermark text!", "error");
    return;
  }

  if (watermarkText.length > 1000) {
    showNotification(
      "Watermark text is too long! Maximum 1000 characters.",
      "error"
    );
    return;
  }

  // Get button and show loading state
  const btn = document.getElementById("embedBtn");
  const btnText = btn.querySelector(".btn-text");
  const btnLoading = btn.querySelector(".btn-loading");

  btn.disabled = true;
  if (btnText && btnLoading) {
    btnText.classList.add("hidden");
    btnLoading.classList.remove("hidden");
  }

  // Show progress bar
  const progressContainer = document.getElementById("embedProgress");
  const progressBar = document.getElementById("embedProgressBar");
  const progressText = document.getElementById("embedProgressText");

  if (progressContainer) {
    progressContainer.classList.add("active");
    progressContainer.style.display = "block";
  }

  try {
    // Update progress
    if (progressBar) progressBar.style.width = "20%";
    if (progressText) progressText.textContent = "Encrypting watermark...";

    // Encrypt watermark if password provided
    const cryptoData = await WatermarkCrypto.encryptWatermark(
      watermarkText,
      password
    );

    const messageToEmbed = cryptoData.isEncrypted
      ? `ENCRYPTED:${cryptoData.salt}:${cryptoData.encrypted}`
      : watermarkText;

    if (progressBar) progressBar.style.width = "40%";
    if (progressText) progressText.textContent = "Processing image...";

    const img = new Image();
    img.onload = function () {
      try {
        if (progressBar) progressBar.style.width = "60%";
        if (progressText) progressText.textContent = "Embedding watermark...";

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convert text to binary with length prefix
        const lengthBinary = messageToEmbed.length
          .toString(2)
          .padStart(16, "0");
        const messageBinary =
          lengthBinary +
          messageToEmbed
            .split("")
            .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join("");

        // Check if image is large enough to hold the message
        if (messageBinary.length > data.length / 4) {
          showNotification(
            "Image is too small! Please use a larger image or shorter text.",
            "error"
          );
          resetEmbedButton();
          return;
        }

        // Embed binary data in LSB of red channel
        for (let i = 0; i < messageBinary.length; i++) {
          data[i * 4] = (data[i * 4] & 0xfe) | parseInt(messageBinary[i]);
        }

        if (progressBar) progressBar.style.width = "80%";
        if (progressText)
          progressText.textContent = "Generating watermarked image...";

        // Put modified data back on canvas
        ctx.putImageData(imageData, 0, 0);
        watermarkedImageData = canvas.toDataURL("image/png");

        // Display watermarked image
        document.getElementById("watermarkedImage").src = watermarkedImageData;
        document.getElementById("watermarkedImage").classList.remove("hidden");
        document
          .getElementById("watermarkedPlaceholder")
          .classList.add("hidden");
        document.getElementById("downloadBtn").classList.remove("hidden");

        if (progressBar) progressBar.style.width = "100%";
        if (progressText) progressText.textContent = "Complete!";

        if (cryptoData.isEncrypted) {
          showNotification(
            "Watermark embedded successfully with password protection!",
            "success"
          );
        } else {
          showNotification("Watermark embedded successfully!", "success");
        }

        // Hide progress after a short delay
        setTimeout(() => {
          if (progressContainer) progressContainer.style.display = "none";
          if (progressText) progressText.textContent = "";
        }, 1500);
      } catch (error) {
        showNotification(
          "Error embedding watermark. Please try again.",
          "error"
        );
      } finally {
        resetEmbedButton();
      }
    };

    img.onerror = function () {
      showNotification(
        "Error loading image. Please try a different image.",
        "error"
      );
      resetEmbedButton();
    };

    img.src = originalImageData;
  } catch (error) {
    showNotification("Error processing watermark. Please try again.", "error");
    resetEmbedButton();
  }
}

// Helper function to reset embed button state
function resetEmbedButton() {
  const btn = document.getElementById("embedBtn");
  const btnText = btn.querySelector(".btn-text");
  const btnLoading = btn.querySelector(".btn-loading");
  const progressContainer = document.getElementById("embedProgress");

  btn.disabled = false;
  if (btnText && btnLoading) {
    btnText.classList.remove("hidden");
    btnLoading.classList.add("hidden");
  }
  if (progressContainer) {
    progressContainer.style.display = "none";
  }
}
