import { api } from "@/utils/api";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const CreateTransactions = () => {
  const { isLoading, data } = api.transactions.getAllBanks.useQuery();
  const [chosenType, setChosenType] = useState("loss");

  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [affectedAccount, setAffectedAccount] = useState<number | null>(null);
  const [transferredAccount, setTransferredAccount] = useState<number | null>(
    null
  );
  const addingTransaction = api.transactions.createNewTransaction.useMutation({
    onSuccess: () => {
      alert("Transaction has been recorded");
    },
  });

  const createNewTransaction = () => {
    if (affectedAccount !== null) {
      if (chosenType === "transfer" && transferredAccount !== null) {
        addingTransaction.mutate({
          amount: Math.abs(amount),
          bankId: affectedAccount,
          description: description,
          type: chosenType,
          transferredBankId: transferredAccount,
        });
      } else {
        addingTransaction.mutate({
          amount: Math.abs(amount),
          bankId: affectedAccount,
          description: description,
          type: chosenType,
          transferredBankId: null,
        });
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex place-items-center justify-center">
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="">
            <div className="fixed bottom-10 right-10 rounded-full bg-light-primary p-3 text-white md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <div className="mx-auto hidden w-fit md:block">
              <button className="mx-auto rounded-md bg-light-primary px-6 py-2 font-bold uppercase text-white transition hover:opacity-80">
                Add Transaction
              </button>
            </div>
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay>
            <div className="absolute left-0 top-0 h-screen w-full bg-black/30 backdrop-blur-sm"></div>
          </Dialog.Overlay>
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-light-accent p-[25px] text-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none md:max-w-[450px]">
            <Dialog.Title className="text-3xl font-bold">
              Add Transactions
            </Dialog.Title>
            <Dialog.Description>
              <div>
                Here you can record money being gained, spent or loaned.
              </div>
              <div className="my-3 grid gap-y-3">
                <input
                  onChange={(e) => setAmount(e.target.valueAsNumber)}
                  required
                  type="number"
                  placeholder="Amount ($)"
                  className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70"
                />
                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70"
                  placeholder="Describe your transaction"
                />
                <div className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70">
                  <select
                    onChange={(e) => setAffectedAccount(Number(e.target.value))}
                    className="w-full bg-transparent outline-none"
                  >
                    {data?.map((bank) => (
                      <option value={bank.id} key={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    disabled={chosenType === "profit"}
                    onClick={() => void setChosenType("profit")}
                    className={`w-full rounded-md ${
                      chosenType === "profit" ? "opacity-70" : ""
                    } bg-green-500 py-2 text-center  font-semibold`}
                  >
                    Profit
                  </button>
                  <button
                    disabled={chosenType === "loss"}
                    onClick={() => void setChosenType("loss")}
                    className={`w-full rounded-md ${
                      chosenType === "loss" ? "opacity-70" : ""
                    } bg-red-500 py-2 text-center  font-semibold`}
                  >
                    Loss
                  </button>
                  {(data?.length ?? 0) > 1 ? (
                    <button
                      disabled={chosenType === "transfer"}
                      onClick={() => void setChosenType("transfer")}
                      className={`w-full rounded-md ${
                        chosenType === "transfer" ? "opacity-70" : ""
                      } bg-yellow-500 py-2 text-center  font-semibold`}
                    >
                      Transfer
                    </button>
                  ) : null}
                </div>
                {chosenType === "transfer" ? (
                  <div className="w-full rounded-md bg-light-secondary/40 px-3 py-2 outline-none  placeholder:text-light-secondary/70">
                    <select
                      onChange={(e) =>
                        setTransferredAccount(Number(e.target.value))
                      }
                      className="w-full bg-transparent outline-none"
                    >
                      {data
                        ?.filter((item) => item.id !== affectedAccount)
                        .map((bank) => (
                          <option value={bank.id} key={bank.id}>
                            {bank.name}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : null}
                <div>
                  <button
                    onClick={() => void createNewTransaction()}
                    className="w-full rounded-md bg-light-secondary/20 py-2 font-semibold uppercase  transition hover:bg-light-secondary/30"
                  >
                    Record {chosenType}
                  </button>
                </div>
              </div>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default CreateTransactions;
