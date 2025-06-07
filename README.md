# SSS-Encoder-Decoder

## Project Purpose

The SSS-Encoder-Decoder is a web application designed to demonstrate a custom text encoding and decoding technique called SSS (Scramble-Shift-Symbol). This project showcases how text can be transformed using a combination of scrambling, character shifting, and symbol manipulation, providing a simple yet illustrative example of custom cryptographic principles. It also includes internationalization to support both English and French languages.

## The SSS (Scramble-Shift-Symbol) Encoding/Decoding Technique

The SSS technique is a three-stage process for encoding text and a corresponding reverse process for decoding.

### Encoding Process:

1.  **Scramble:**
    *   The input text is first scrambled by rearranging its characters. The scrambling algorithm divides the text into segments and reorders these segments in a predefined or key-dependent manner. For example, if the text is "HELLO WORLD", it might be split into "HELLO" and " WORLD", and then reordered to " WORLDHELLO". The specific scrambling pattern is a core part of this layer.

2.  **Shift:**
    *   After scrambling, each character in the text is shifted by a certain numerical value based on its ASCII (or Unicode) representation. This is similar to a Caesar cipher. For instance, with a shift key of +3, 'A' would become 'D', 'B' would become 'E', and so on. The shift can be a fixed value or vary based on a key or character position. Special characters and numbers might be handled differently or excluded from shifting.

3.  **Symbol Manipulation:**
    *   In the final encoding stage, specific characters or patterns within the shifted text are replaced with predefined symbols or sequences of symbols. For example, spaces might be replaced with underscores (`_`), or vowels might be replaced with specific symbols (e.g., 'a' becomes '@', 'e' becomes '#'). This adds another layer of obfuscation.

### Decoding Process:

Decoding reverses the encoding steps in the opposite order:

1.  **Reverse Symbol Manipulation:**
    *   The symbols are replaced with their original characters. For instance, underscores are converted back to spaces, and symbols like '@' or '#' are reverted to their original vowel counterparts.

2.  **Reverse Shift:**
    *   Each character is shifted back by the same numerical value used during encoding, but in the opposite direction. If the encoding shift was +3, the decoding shift will be -3.

3.  **Unscramble:**
    *   The text is unscrambled by rearranging the segments back to their original order. This requires knowing the initial scrambling pattern.

The SSS technique aims to provide a basic level of text obfuscation. The security of this method relies on the secrecy of the scrambling pattern, the shift value(s), and the symbol mapping rules.

## How to Use the Web Application

The SSS-Encoder-Decoder web application is straightforward to use:

1.  **Enter Text:**
    *   In the input text area, type or paste the text you wish to encode or decode.

2.  **Select Operation:**
    *   Choose whether you want to "Encode" or "Decode" the input text using the provided radio buttons or dropdown menu.

3.  **Choose Language (Optional):**
    *   The application interface supports multiple languages. Select your preferred language (English or French) from the language selection option, usually located at the top or bottom of the page. The text labels and instructions will change accordingly.

4.  **Process Text:**
    *   Click the "Encode" or "Decode" button (the label might change based on your selection in step 2).

5.  **View Output:**
    *   The transformed text (either encoded or decoded) will appear in the output text area. You can then copy this text for your use.

## Internationalization

This application supports internationalization for its user interface. Currently, it offers:
*   English (en)
*   French (fr)

This allows users to experience the application in their preferred language, making it more accessible.