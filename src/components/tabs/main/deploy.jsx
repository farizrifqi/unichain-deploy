'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
export default function DeployTab({ ctx }) {

    const { isLoading, loadingMessage, deployContract, loadingBy } = ctx

    const formSchema = z.object({
        tokenName: z.string().min(1).max(50),
        tokenSymbol: z.string().min(3).max(10),
        tokenDecimals: z.string().min(1).max(18),
        tokenSupply: z.string().min(1).max(((2 ** 256) - 1).length),
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tokenName: "",
            tokenSymbol: "",
            tokenDecimals: "8",
            tokenSupply: "1000000"
        },
    })
    async function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        await deployContract(values.tokenName, values.tokenSymbol, values.tokenDecimals, values.tokenSupply)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle><div className="flex flex-col gap-4">
                            <Badge className={'w-fit'}>Cost 0.001 ETH</Badge>
                            <span>Deploy</span>
                        </div></CardTitle>
                        <CardDescription>
                            Deploy an ERC20 Contract.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="tokenName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Token Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Token Name" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tokenSymbol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Token Symbol</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Token Symbol" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tokenDecimals"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Decimals</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Token Decimals" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tokenSupply"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Total Supply</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Total Supply" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading}>{isLoading && loadingBy == "deployContract" ? <><ReloadIcon className="animate-spin mr-1" />{loadingMessage}</> : "Deploy"}</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}