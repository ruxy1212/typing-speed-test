export default function Menu( ) {
    return (
        <div className="flex justify-between">
            <div className="flex gap-4 text-ts-neutral-400">
                <div className="flex gap-1.5">
                    <span>Difficulty:{' '}</span>
                    <label>
                        <input type="radio" name="difficulty" id="easy" />
                        Easy
                    </label>
                    <label>
                        <input type="radio" name="difficulty" id="medium" />
                        Medium
                    </label>
                    <label>
                        <input type="radio" name="difficulty" id="hard" />
                        Hard
                    </label>
                </div>
                <div className="flex gap-1.5">
                    <span>Mode:{' '}</span>
                    <label>
                        <input type="radio" name="mode" id="timed" />
                        Timed (60s)
                    </label>
                    <label>
                        <input type="radio" name="mode" id="passage" />
                        Passage
                    </label>
                </div>
            </div>
            <div>
                <button className="bg-ts-primary-500 text-ts-neutral-0 px-4 py-2 rounded-md">
                    Start Test
                </button>
            </div>
        </div>
    )
}