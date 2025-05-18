# Vibe Note

## A Markdown Editor with Dynamic Vibe and Adaptive Audio

Vibe Note is a versatile Markdown editor designed to enhance your writing experience with personalized audio and visual feedback. It's more than just a text editor; it's an environment that adapts to your rhythm and pace, creating a dynamic and engaging experience.

**Key Features:**

* **Live Markdown Preview:** Instantly see your formatted text as you type.
* **Syntax Highlighting:** View code blocks with highlighted syntax for various programming languages (JavaScript, Python, HTML, CSS, and more).
* **Dynamic Vibe:** Experience a unique background animation that reacts to your typing speed, creating a visually engaging experience tailored to your pace.
* **Adaptive Music:** The background music adjusts in tempo and intensity based on your typing rhythm, creating an immersive and personalized audio experience.  The music adapts to your writing style, making typing faster feel more energetic, and slower typing create a more ambient atmosphere.
* **Document Summary (Powered by Gemini):** Generate concise summaries of your documents using the Gemini API.  Press Alt+S to generate a summary.  This feature provides quick insights and context.
* **Download Options:** Save your documents as Markdown files, allowing you to easily share or archive your work.
* **Customizable Theme:** Choose between light and dark themes for a personalized visual experience.
* **Accessible Keyboard Shortcuts:** Efficiently access features using keyboard shortcuts:
    * `Alt+M`: Toggle music on/off.
    * `Alt+T`: Toggle between light and dark themes.
    * `Alt+S`: Generate and display document summary.
    * `Alt+H`: Highlight selected text (within the preview area).
    * `Alt+D`: Download the Markdown file.
* **Interactive Tutorial:** A guided tutorial walks you through the key features, making it easy to get started with Vibe Note.


**How Vibe Note is Useful:**

Vibe Note enhances focus and writing experience in various contexts:

* **Writers:**  Create and format articles, blog posts, and stories. The personalized audio and visual feedback can help maintain focus and build momentum.
* **Developers:**  Edit and create code blocks quickly, taking advantage of the syntax highlighting.  The adaptive music might inspire a sense of "coding flow."
* **Students:**  Create outlines, notes, and assignments with ease.
* **Anyone Who Writes:** Vibe Note's dynamic interface and adaptive features transform writing from a mundane task into a more engaging and enjoyable experience.


**How the Adaptive Audio Works:**

Vibe Note analyzes your typing rhythm (the time between keystrokes).  Faster typing typically results in more energetic music, whereas slower typing produces a more ambient and calming sound. This personalized audio response helps to create an environment conducive to your writing style.

**How to Get Started:**

1. **Clone the Repository:**
   ```bash
   git clone <repository_url>
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access in Your Browser:** Open your browser and navigate to `http://localhost:5173`.

**Key Improvements & Considerations:**

* **Robust Error Handling:**  Vibe Note includes comprehensive error handling for API calls (Gemini) and other potential issues.  This ensures a more stable and reliable user experience, especially when fetching summaries.
* **Clearer Documentation:**  The README is now improved with a more detailed overview of features and usage instructions, plus specific examples.


**Further Enhancements:**

* **Advanced Music Modes:** Offer various music modes (e.g., focused, ambient, energetic) to further tailor the audio experience.
* **Customization Options:** Allow users to customize the music (e.g., different instruments, styles) and the visual vibe effects.
* **Integration with other tools:**  Consider integrating with other tools to further extend its functionality (e.g., a file picker to select Markdown files).
* **Visualizations:** Implement more sophisticated visualizations to accompany the typing speed and intensity.
* **Import/Export:** Enable importing and exporting of Markdown files (and potentially other formats) for greater flexibility.


**Note:** This project depends on external libraries (e.g., marked, DOMPurify).  Make sure these are correctly installed and configured. Also, remember that you need to replace `<repository_url>` with the actual URL of the repository.  You'll need the proper API keys for the Gemini model in your `.env` file.


This detailed README provides a better understanding of Vibe Note's features and how to use it. Remember to consult the project's code for specific implementation details.
