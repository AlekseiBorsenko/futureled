<h2>Nome: <?php echo $name; ?></h2>
<h2>Email: <?php echo $email; ?></h2>
<h2>Telefone: <?php echo $phone; ?></h2>
<table>
    <thead>
        <tr>
            <th>Titulo</th>
            <th>Quantidade</th>
            <th>Preço /un</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach($checkoutData as $value) {?>
            <tr>
                <td><?php echo $value['name']?></td>
                <td><?php echo $value['quantity']?></td>
                <td><?php echo $value['price']?></td>
                <td><?php echo $value['description']?></td>
                </tr>

        <?php } ?>
    </tbody>
</table>